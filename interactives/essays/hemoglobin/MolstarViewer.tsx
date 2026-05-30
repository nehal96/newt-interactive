import { useCallback, useEffect, useRef, useState } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import type { StateObjectSelector } from "molstar/lib/mol-state";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
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
// Mostly canvas post-processing (ambient occlusion + black outlines) over a
// warm near-white background, plus soft lighting. Applied once after boot;
// independent of which representation is shown.
function applyVillinLook(plugin: PluginUIContext) {
  plugin.canvas3d?.setProps({
    renderer: {
      backgroundColor: 0xfcfbf9,
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

// --- Representation helpers -------------------------------------------------
type RepOpts = {
  typeParams?: Record<string, unknown>;
  colorParams?: Record<string, unknown>;
};

function repProps(type: string, color: string, opts?: RepOpts) {
  const p: Record<string, unknown> = { type, color };
  if (opts?.typeParams) p.typeParams = opts.typeParams;
  if (opts?.colorParams) p.colorParams = opts.colorParams;
  return p;
}

function addRep(
  plugin: PluginUIContext,
  target: StateObjectSelector,
  props: Record<string, unknown>
) {
  return plugin.builders.structure.representation.addRepresentation(
    target,
    props as any
  );
}

// A style builds representations on a structure and returns the top-level refs
// it created (components or whole-structure reps). Those refs are deleted on
// the next restyle — deleting a component cascades to its representations.
type StyleBuilder = (
  plugin: PluginUIContext,
  structure: StateObjectSelector,
  color: string
) => Promise<StateObjectSelector[]>;

// Translucent cyan surface "halo" layer from the villin snapshot.
const HALO = (): Record<string, unknown> =>
  repProps("gaussian-surface", "uniform", {
    typeParams: { alpha: 0.1, sizeFactor: 3, smoothness: 1.5, radiusOffset: 0.3 },
    colorParams: { value: 0x009ce0 },
  });

// Factory: apply one or more representation layers to the whole structure.
function wholeStructure(
  layers: (color: string) => Record<string, unknown>[]
): StyleBuilder {
  return async (plugin, structure, color) => {
    const refs: StateObjectSelector[] = [];
    for (const props of layers(color)) {
      refs.push(await addRep(plugin, structure, props));
    }
    return refs;
  };
}

// MolScript: select every iron atom (the heme Fe — the star of the story).
const IRON_EXPR = MS.struct.generator.atomGroups({
  "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es("Fe")]),
});

// The real hemoglobin view: protein context + the functional heme + iron,
// each as its own component so we can later focus/highlight/animate the heme.
const hemoglobinStyle: StyleBuilder = async (plugin, structure, color) => {
  const sb = plugin.builders.structure;
  const created: StateObjectSelector[] = [];

  // Protein → cartoon (driven by the color dropdown).
  const polymer = await sb.tryCreateComponentStatic(structure, "polymer");
  if (polymer) {
    created.push(polymer);
    await addRep(
      plugin,
      polymer,
      repProps("cartoon", color, {
        typeParams: { sizeFactor: 0.2 },
        colorParams:
          color === "secondary-structure"
            ? { saturation: -1, lightness: 0 }
            : undefined,
      })
    );
  }

  // Heme (and any other ligands) → ball-and-stick, colored by element so the
  // Fe reads orange and the porphyrin nitrogens blue.
  const ligand = await sb.tryCreateComponentStatic(structure, "ligand");
  if (ligand) {
    created.push(ligand);
    await addRep(plugin, ligand, repProps("ball-and-stick", "element-symbol"));
  }

  // Iron → fat spacefill spheres to emphasize it.
  const iron = await sb.tryCreateComponentFromExpression(
    structure,
    IRON_EXPR,
    "iron"
  );
  if (iron) {
    created.push(iron);
    await addRep(
      plugin,
      iron,
      repProps("spacefill", "element-symbol", { typeParams: { sizeFactor: 1.1 } })
    );
  }

  return created;
};

const STYLES: Record<string, StyleBuilder> = {
  "Hemoglobin (protein + heme)": hemoglobinStyle,
  "Villin (cartoon + halo)": wholeStructure((color) => [
    repProps("cartoon", color, {
      typeParams: { sizeFactor: 0.2 },
      colorParams:
        color === "secondary-structure"
          ? { saturation: -1, lightness: 0 }
          : undefined,
    }),
    HALO(),
  ]),
  cartoon: wholeStructure((color) => [repProps("cartoon", color)]),
  "ball-and-stick": wholeStructure((color) => [
    repProps("ball-and-stick", color),
  ]),
  spacefill: wholeStructure((color) => [repProps("spacefill", color)]),
  "molecular-surface": wholeStructure((color) => [
    repProps("molecular-surface", color),
  ]),
  "gaussian-surface": wholeStructure((color) => [
    repProps("gaussian-surface", color),
  ]),
  putty: wholeStructure((color) => [repProps("putty", color)]),
  "surface halo only": wholeStructure(() => [HALO()]),
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
 * docs/hemoglobin-3d-animation-exploration.md). Loads one vendored structure
 * and lets you experiment with representation styles + color themes. The
 * "Hemoglobin (protein + heme)" style splits the structure into
 * polymer/ligand/iron components — the foundation for later focusing and
 * animating the heme. No morph/animation yet.
 */
export default function MolstarViewer({
  url = "/structures/2HHB.pdb",
  format = "pdb",
  className,
  initialStyle = "Hemoglobin (protein + heme)",
  initialColorTheme = "secondary-structure",
}: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const structureRef = useRef<StateObjectSelector | null>(null);
  const createdRefs = useRef<StateObjectSelector[]>([]);
  const genRef = useRef(0);

  const [style, setStyle] = useState<string>(initialStyle as string);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(initialColorTheme);
  const [ready, setReady] = useState(false);

  // Replace all current representation layers/components with the chosen style.
  // A generation token guards against overlapping calls (rapid dropdown clicks).
  const applyStyle = useCallback(async (styleKey: string, color: string) => {
    const plugin = pluginRef.current;
    const structure = structureRef.current;
    if (!plugin || !structure) return;

    const gen = ++genRef.current;

    if (createdRefs.current.length) {
      const b = plugin.build();
      for (const r of createdRefs.current) b.delete(r);
      await b.commit();
      createdRefs.current = [];
    }
    if (gen !== genRef.current) return; // superseded while deleting

    const created = await STYLES[styleKey](plugin, structure, color);

    if (gen !== genRef.current) {
      // Superseded mid-build — clean up what we just made.
      const b = plugin.build();
      for (const r of created) b.delete(r);
      await b.commit();
      return;
    }
    createdRefs.current = created;
  }, []);

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
      createdRefs.current = [];
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
