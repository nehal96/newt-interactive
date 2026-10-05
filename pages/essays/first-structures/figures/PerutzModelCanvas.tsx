// Perutz's sliced hemoglobin model, rebuilt from 2HHB by scripts/hemoglobin_slabs.py.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  CylinderGeometry,
  ExtrudeGeometry,
  Path,
  Quaternion,
  Shape,
  Vector2,
  Vector3,
  type BufferGeometry,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Ring = [number, number][];
type Slabs = {
  spacing: number;
  chains: Record<string, string>;
  slices: { z: number; chain: string; shapes: { outer: Ring; holes: Ring[] }[] }[];
  haems: {
    chain: string;
    centre: [number, number, number];
    normal: [number, number, number];
    radius: number;
  }[];
};

const SLABS_URL = "/structures/hemoglobin-slabs.json";
const BEVEL = 0.14;

export type Part = { kind: "alpha" | "beta" | "haem"; chain: string };

const GHOST = 0.75;
const GHOST_CHAIN = "#A9A6B1";

const MODEL_COLOURS = {
  alpha: "#ECE8DF",
  beta: "#2A292D",
  haem: "#A92A22",
};

function toShape({ outer, holes }: { outer: Ring; holes: Ring[] }) {
  const shape = new Shape(outer.map(([x, y]) => new Vector2(x, y)));
  for (const h of holes) shape.holes.push(new Path(h.map(([x, y]) => new Vector2(x, y))));
  return shape;
}

function useSlabs() {
  const [data, setData] = useState<Slabs | null>(null);
  useEffect(() => {
    let live = true;
    fetch(SLABS_URL)
      .then((r) => r.json())
      .then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, []);
  return data;
}

function Surface({ colour, ghost, roughness }: { colour: string; ghost: boolean; roughness: number }) {
  return (
    <meshStandardMaterial
      color={colour}
      roughness={roughness}
      flatShading
      transparent
      opacity={ghost ? GHOST : 1}
      depthWrite={!ghost}
    />
  );
}

function Model({
  data,
  hover,
  onHover,
}: {
  data: Slabs;
  hover: Part | null;
  onHover: (part: Part | null) => void;
}) {
  const chains = useMemo(() => {
    const byChain: Record<string, BufferGeometry[]> = {};
    const depth = data.spacing - 2 * BEVEL;
    for (const s of data.slices) {
      for (const sh of s.shapes) {
        const g = new ExtrudeGeometry(toShape(sh), {
          depth,
          curveSegments: 1,
          bevelEnabled: true,
          bevelThickness: BEVEL,
          bevelSize: BEVEL,
          bevelSegments: 1,
        });
        g.translate(0, 0, s.z - depth / 2);
        (byChain[s.chain] ??= []).push(g);
      }
    }
    return Object.entries(byChain).map(([chain, gs]) => ({
      chain,
      kind: data.chains[chain] as Part["kind"],
      geometry: mergeGeometries(gs)!,
    }));
  }, [data]);

  const haems = useMemo(() => {
    const up = new Vector3(0, 1, 0);
    return data.haems.map((h) => ({
      key: h.chain,
      position: h.centre,
      quaternion: new Quaternion().setFromUnitVectors(up, new Vector3(...h.normal)),
      geometry: new CylinderGeometry(h.radius, h.radius, data.spacing, 48),
    }));
  }, [data]);

  const dimmed = (part: Part) =>
    hover !== null && (hover.kind !== part.kind || hover.chain !== part.chain);
  const handlers = (part: Part) => ({
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHover(part);
    },
    onPointerOut: () => onHover(null),
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHover(part);
    },
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {chains.map((c) => {
        const part = { kind: c.kind, chain: c.chain };
        return (
          <mesh key={c.chain} geometry={c.geometry} {...handlers(part)}>
            <Surface
              colour={dimmed(part) ? GHOST_CHAIN : MODEL_COLOURS[c.kind as "alpha" | "beta"]}
              ghost={dimmed(part)}
              roughness={0.9}
            />
          </mesh>
        );
      })}
      {haems.map((h) => {
        const part: Part = { kind: "haem", chain: h.key };
        return (
          <mesh
            key={h.key}
            geometry={h.geometry}
            position={h.position}
            quaternion={h.quaternion}
            {...handlers(part)}
          >
            <Surface colour={MODEL_COLOURS.haem} ghost={dimmed(part)} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PerutzModelCanvas({
  active,
  hover,
  onHover,
}: {
  active: boolean;
  hover: Part | null;
  onHover: (part: Part | null) => void;
}) {
  const data = useSlabs();
  // While dragging, the pointer sweeps across parts; hold the highlight until the drag ends.
  const dragging = useRef(false);
  const latest = useRef<Part | null>(hover);
  const report = (part: Part | null) => {
    latest.current = part;
    if (!dragging.current) onHover(part);
  };
  return (
    <Canvas
      onPointerMissed={() => report(null)}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [60, 40, 100], near: 1, far: 1000 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <hemisphereLight args={["#ffffff", "#8a8798", 1.1]} />
      <directionalLight position={[50, 120, 90]} intensity={2.4} />
      <directionalLight position={[-90, 10, 40]} intensity={0.9} />
      <directionalLight position={[0, -60, -90]} intensity={0.5} />
      {data && <Model data={data} hover={hover} onHover={report} />}
      <OrbitControls
        onStart={() => {
          dragging.current = true;
        }}
        onEnd={() => {
          dragging.current = false;
          onHover(latest.current);
        }}
        enablePan={false}
        enableZoom={false}
        autoRotate={active && hover === null}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
