import { useCallback, useEffect, useRef, useState } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import type { StateObjectSelector } from "molstar/lib/mol-state";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
// Precompiled stylesheet (light skin baked in) — no `sass` toolchain needed.
import "molstar/build/viewer/molstar.css";

// Build the *complete* "on" params for a Mol* Mapped param, then layer
// overrides on top. Passing a partial params object to setProps drops nested
// sub-params (e.g. occlusion's `multiScale`), which later crashes the render
// pass with "Cannot read properties of undefined (reading 'name')".
function onWith(mapped: any, overrides: Record<string, unknown>) {
  const variant = mapped.map("on");
  const defaults = PD.getDefaultValues(variant.params ?? variant);
  return { name: "on", params: { ...defaults, ...overrides } };
}

// --- "Look" borrowed from molstar.org's villin-md.molx snapshot -----------
// The visual style is mostly the canvas post-processing (ambient occlusion +
// black outlines) over a warm near-white background, plus soft lighting.
// Applied once after the engine boots; independent of which representation
// is shown.
function applyVillinLook(plugin: PluginUIContext) {
  plugin.canvas3d?.setProps({
    renderer: {
      backgroundColor: 0xfcfbf9, // warm near-white (villin bg)
      ambientIntensity: 0.4,
      interiorDarkening: 0.5,
    },
    postprocessing: {
      occlusion: onWith(PostprocessingParams.occlusion, {
        samples: 32,
        radius: 5,
        bias: 0.8,
        blurKernelSize: 15,
      }),
      outline: onWith(PostprocessingParams.outline, {
        scale: 1,
        threshold: 0.33,
        color: 0x000000,
        includeTransparent: true,
      }),
    },
    cameraFog: { name: "on", params: { intensity: 15 } },
  } as any);
}

// --- Representation layers --------------------------------------------------
// A "style" is one or more representation layers. `color` is the color theme
// chosen in the UI; it drives the *primary* (first) layer. Extra layers (e.g.
// the translucent surface halo) keep their own baked-in color.
type Layer = {
  type: string;
  typeParams?: Record<string, unknown>;
  color: string;
  colorParams?: Record<string, unknown>;
};

const HALO: Layer = {
  type: "gaussian-surface",
  typeParams: { alpha: 0.1, sizeFactor: 3, smoothness: 1.5, radiusOffset: 0.3 },
  color: "uniform",
  colorParams: { value: 0x009ce0 }, // villin cyan
};

const STYLES: Record<string, (color: string) => Layer[]> = {
  // Faithful to the villin snapshot: secondary-structure cartoon inside a
  // faint cyan surface halo.
  "Villin (cartoon + halo)": (color) => [
    {
      type: "cartoon",
      typeParams: { sizeFactor: 0.2 },
      color,
      colorParams:
        color === "secondary-structure"
          ? { saturation: -1, lightness: 0 }
          : undefined,
    },
    HALO,
  ],
  cartoon: (color) => [{ type: "cartoon", color }],
  "ball-and-stick": (color) => [{ type: "ball-and-stick", color }],
  spacefill: (color) => [{ type: "spacefill", color }],
  "molecular-surface": (color) => [{ type: "molecular-surface", color }],
  "gaussian-surface": (color) => [{ type: "gaussian-surface", color }],
  putty: (color) => [{ type: "putty", color }],
  "surface halo only": () => [HALO],
};

const COLOR_THEMES = [
  "secondary-structure",
  "chain-id",
  "element-symbol",
  "residue-name",
  "molecule-type",
  "hydrophobicity",
  "polymer-id",
  "sequence-id",
  "entity-id",
  "uncertainty",
  "illustrative",
  "uniform",
] as const;

type ColorTheme = (typeof COLOR_THEMES)[number];

interface MolstarViewerProps {
  /** Path to a structure file served from /public. */
  url?: string;
  format?: "pdb" | "mmcif";
  className?: string;
  initialStyle?: keyof typeof STYLES;
  initialColorTheme?: ColorTheme;
}

/**
 * Minimal, UI-stripped Mol* viewer with the villin-md "look" (see
 * docs/hemoglobin-3d-animation-exploration.md). Loads one vendored structure,
 * applies the borrowed canvas post-processing, and lets you experiment with
 * representation styles + color themes. No morph/animation yet.
 */
export default function MolstarViewer({
  url = "/structures/2HHB.pdb",
  format = "pdb",
  className,
  initialStyle = "Villin (cartoon + halo)",
  initialColorTheme = "secondary-structure",
}: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const structureRef = useRef<StateObjectSelector | null>(null);
  const reprRefs = useRef<StateObjectSelector[]>([]);

  const [style, setStyle] = useState<string>(initialStyle as string);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(initialColorTheme);
  const [ready, setReady] = useState(false);

  // Replace all current representation layers with the chosen style.
  const applyStyle = useCallback(
    async (styleKey: string, color: string) => {
      const plugin = pluginRef.current;
      const structure = structureRef.current;
      if (!plugin || !structure) return;

      if (reprRefs.current.length) {
        const b = plugin.build();
        for (const r of reprRefs.current) b.delete(r);
        await b.commit();
        reprRefs.current = [];
      }

      const layers = STYLES[styleKey](color);
      const refs: StateObjectSelector[] = [];
      for (const layer of layers) {
        const props: Record<string, unknown> = {
          type: layer.type,
          color: layer.color,
        };
        if (layer.typeParams) props.typeParams = layer.typeParams;
        if (layer.colorParams) props.colorParams = layer.colorParams;
        const ref =
          await plugin.builders.structure.representation.addRepresentation(
            structure,
            props as any
          );
        refs.push(ref);
      }
      reprRefs.current = refs;
    },
    []
  );

  // Mount: spin up the engine, apply the look, load the structure once.
  useEffect(() => {
    let disposed = false;

    async function init() {
      if (!containerRef.current) return;

      const plugin = await createPluginUI({
        target: containerRef.current,
        render: renderReact18,
        spec: {
          ...DefaultPluginUISpec(),
          layout: { initial: { isExpanded: false, showControls: false } },
          components: { remoteState: "none" },
        },
      });

      if (disposed) {
        plugin.dispose();
        return;
      }
      pluginRef.current = plugin;
      applyVillinLook(plugin);

      const data = await plugin.builders.data.download(
        { url, isBinary: false },
        { state: { isGhost: true } }
      );
      const trajectory = await plugin.builders.structure.parseTrajectory(
        data,
        format
      );
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      if (disposed) {
        plugin.dispose();
        return;
      }
      structureRef.current = structure;
      setReady(true);
    }

    init();

    return () => {
      disposed = true;
      pluginRef.current?.dispose();
      pluginRef.current = null;
      structureRef.current = null;
      reprRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, format]);

  // Apply style on first ready and whenever the controls change.
  useEffect(() => {
    if (!ready) return;
    applyStyle(style, colorTheme);
  }, [ready, style, colorTheme, applyStyle]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* Experimentation overlay */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 rounded-md bg-white/80 p-2 text-xs shadow-md backdrop-blur">
        <label className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Style</span>
          <select
            className="rounded border border-slate-300 bg-white px-1 py-0.5 text-slate-700 outline-none"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {Object.keys(STYLES).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Color</span>
          <select
            className="rounded border border-slate-300 bg-white px-1 py-0.5 text-slate-700 outline-none"
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value as ColorTheme)}
          >
            {COLOR_THEMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
