import { useEffect, useRef } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
// Precompiled stylesheet (light skin baked in) — no `sass` toolchain needed.
import "molstar/build/viewer/molstar.css";

// A lightweight, self-contained Mol* viewer for the *anatomy* build-up: load one
// small vendored structure and show it with the shared "villin look", framed and
// static. Deliberately separate from the scene-driven MolstarViewer.tsx (which
// loads the full protein + the O₂ morph and steps through a cinematic) — each
// anatomy beat is its own block, so this stays simple and only loads what it
// needs. The villin-look helpers are duplicated here (small, ~25 lines) to keep
// this zero-risk to the working scene viewer; consolidate when we do the full
// inline refactor.

function onWith(mapped: any, overrides: Record<string, unknown>) {
  const variant = mapped.map("on");
  const defaults = PD.getDefaultValues(variant.params ?? variant);
  return { name: "on", params: { ...defaults, ...overrides } };
}

function applyVillinLook(plugin: PluginUIContext) {
  plugin.canvas3d?.setProps({
    renderer: {
      backgroundColor: 0xffffff,
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
  } as any);
}

type MoleculeViewerProps = {
  /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
  url: string;
  representation?: "spacefill" | "ball-and-stick";
  /** If set, color uniformly with this hex; otherwise color by element. */
  uniformColor?: number;
  sizeFactor?: number;
  className?: string;
};

export default function MoleculeViewer({
  url,
  representation = "spacefill",
  uniformColor,
  sizeFactor,
  className,
}: MoleculeViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);

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
        "pdb"
      );
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      const props: Record<string, unknown> = {
        type: representation,
        color: uniformColor != null ? "uniform" : "element-symbol",
      };
      if (uniformColor != null) props.colorParams = { value: uniformColor };
      if (sizeFactor != null) props.typeParams = { sizeFactor };
      await plugin.builders.structure.representation.addRepresentation(
        structure,
        props as any
      );

      if (disposed) {
        plugin.dispose();
        return;
      }
      plugin.managers.camera.reset(undefined, 0);
    }

    init();

    return () => {
      disposed = true;
      pluginRef.current?.dispose();
      pluginRef.current = null;
    };
  }, [url, representation, uniformColor, sizeFactor]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
