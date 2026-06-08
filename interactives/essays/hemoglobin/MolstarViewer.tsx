import { useCallback, useEffect, useRef, useState } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { StateSelection } from "molstar/lib/mol-state";
import type { StateObjectSelector } from "molstar/lib/mol-state";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { Script } from "molstar/lib/mol-script/script";
import { StructureSelection } from "molstar/lib/mol-model/structure";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { setSubtreeVisibility } from "molstar/lib/mol-plugin/behavior/static/state";
import { AnimateModelIndex } from "molstar/lib/mol-plugin-state/animation/built-in/model-index";
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

// Tight pocket view for the oxygenation morph (heme + proximal His + O2).
// A lone His residue won't form a cartoon, so the whole pocket is sticks
// (element-colored: Fe orange, ring N blue, incoming O2 red) with the Fe
// emphasized as a fat sphere — the atom the eye should track as it snaps in.
const hemeCloseupStyle: StyleBuilder = async (plugin, structure) => {
  const created: StateObjectSelector[] = [];
  created.push(
    await addRep(plugin, structure, repProps("ball-and-stick", "element-symbol"))
  );
  const iron = await plugin.builders.structure.tryCreateComponentFromExpression(
    structure,
    IRON_EXPR,
    "iron-closeup"
  );
  if (iron) {
    created.push(iron);
    await addRep(
      plugin,
      iron,
      repProps("spacefill", "element-symbol", { typeParams: { sizeFactor: 0.9 } })
    );
  }
  return created;
};

const STYLES: Record<string, StyleBuilder> = {
  "Heme close-up (oxygenation)": hemeCloseupStyle,
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

type ColorTheme =
  | "secondary-structure"
  | "chain-id"
  | "element-symbol"
  | "residue-name"
  | "molecule-type"
  | "uniform";

// --- The two vendored structures, loaded together into one plugin ----------
// Their coordinates share a frame: the morph pocket was carved out of 2HHB's
// chain-A heme (HEM A 142 + His A 87) with positions preserved, so frame 0 of
// the morph sits *exactly* where that heme is in the full protein. That lets
// the camera fly continuously from the whole molecule down into the pocket,
// and the heme we animate is the same one the cartoon wraps around.
type StructureSpec = {
  url: string;
  style: keyof typeof STYLES;
  colorTheme: ColorTheme;
};

const PROTEIN: StructureSpec = {
  url: "/structures/2HHB.pdb",
  // A translucent villin "cloud" look (cloud + heme, with an animated halo-only
  // fade on zoom-in) was explored and parked — see
  // docs/experiments/villin-cloud-experiment.md to bring it back.
  style: "Hemoglobin (protein + heme)",
  colorTheme: "chain-id",
};

const MORPH: StructureSpec = {
  url: "/structures/heme-oxygenation-morph.pdb",
  style: "Heme close-up (oxygenation)",
  colorTheme: "element-symbol",
};

// A structure once it's loaded and styled. `modelRef` is the
// model-from-trajectory transform — updating its `modelIndex` scrubs the morph.
type LoadedStructure = {
  structure: StateObjectSelector;
  modelRef: string;
  frameCount: number;
  refs: StateObjectSelector[];
};

type ViewerCtx = {
  protein: LoadedStructure;
  morph: LoadedStructure;
  /** Measurement-label nodes added by the current scene, deleted on the next. */
  labelRefs: StateObjectSelector[];
};

// --- Cinematic helpers (imperative Mol* calls) -----------------------------
// `applyScene` (below) is indexed in lockstep with HEMOGLOBIN_SCENES in
// ./scenes — keep the two in sync when adding tutorial steps.

// MolScript selection → Loci (camera target / label anchor). Returns the Fe
// atom(s) of the given structure.
function ironLociOf(structure: StateObjectSelector) {
  const sel = Script.getStructureSelection(IRON_EXPR, structure.data as any);
  return StructureSelection.toLociWithSourceUnits(sel);
}

// Scrub a multi-model trajectory to an arbitrary frame (0-based), the same way
// AnimateModelIndex does under the hood — by updating the model transform.
async function setMorphFrame(
  plugin: PluginUIContext,
  ctx: ViewerCtx,
  frame: number
) {
  const state = plugin.state.data;
  const update = state.build();
  update.to(ctx.morph.modelRef).update((old: any) => {
    old.modelIndex = frame;
  });
  await PluginCommands.State.Update(plugin, {
    state,
    tree: update,
    options: { doNotLogTiming: true },
  });
}

// Fade the protein to a ghost (or back to solid) by setting alpha on every
// representation in its subtree. We select Representation3D cells rather than
// the style's top-level refs so this works for any style: a whole-structure
// cartoon (the rep is a direct child of the structure) *and* the component-split
// "Hemoglobin (protein + heme)" style (where reps are nested under the
// polymer/ligand/iron components). `produce` (immer) makes the mutation safe.
async function setProteinAlpha(
  plugin: PluginUIContext,
  ctx: ViewerCtx,
  alpha: number
) {
  const cells = plugin.state.data.select(
    StateSelection.Generators.ofType(
      PluginStateObject.Molecule.Structure.Representation3D,
      ctx.protein.structure.ref
    )
  );
  const update = plugin.build();
  for (const cell of cells) {
    update.to(cell.transform.ref).update((old: any) => {
      if (old?.type?.params) old.type.params.alpha = alpha;
    });
  }
  await update.commit();
}

// Show/hide the protein's heme + iron representations (the ball-and-stick and
// spacefill layers — everything but the cartoon). On the binding scene we hide
// them so chain A's static heme doesn't sit as a faint ghost on top of the
// solid animated morph pocket; on the overview we bring them back.
function setProteinHemesVisible(
  plugin: PluginUIContext,
  ctx: ViewerCtx,
  visible: boolean
) {
  const cells = plugin.state.data.select(
    StateSelection.Generators.ofType(
      PluginStateObject.Molecule.Structure.Representation3D,
      ctx.protein.structure.ref
    )
  );
  for (const cell of cells) {
    const typeName = (cell.transform.params as any)?.type?.name;
    if (typeName === "ball-and-stick" || typeName === "spacefill") {
      setSubtreeVisibility(plugin.state.data, cell.transform.ref, !visible);
    }
  }
}

// Drop a billboard label (custom text) on a loci; remember it for teardown.
async function addLabel(
  plugin: PluginUIContext,
  ctx: ViewerCtx,
  loci: any,
  text: string
) {
  const res = await plugin.managers.structure.measurement.addLabel(loci, {
    visualParams: { customText: text } as any,
  });
  if (res?.selection) ctx.labelRefs.push(res.selection);
}

async function clearLabels(plugin: PluginUIContext, ctx: ViewerCtx) {
  if (!ctx.labelRefs.length) return;
  const b = plugin.build();
  for (const r of ctx.labelRefs) b.delete(r);
  await b.commit();
  ctx.labelRefs = [];
}

interface MolstarViewerProps {
  className?: string;
  /** Index into HEMOGLOBIN_SCENES; applied reactively as the step changes. */
  scene?: number;
}

/**
 * Client-only Mol* viewer for the hemoglobin tutorial (see
 * docs/hemoglobin-3d-animation-exploration.md). Loads the full protein (2HHB)
 * and the baked heme-oxygenation morph into one plugin — sharing a coordinate
 * frame — then drives a *cinematic layer* imperatively from the `scene` prop:
 * camera moves, an alpha fade, the trajectory, and labels are applied per step.
 */
export default function MolstarViewer({
  className,
  scene = 0,
}: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const ctxRef = useRef<ViewerCtx | null>(null);
  // Guards against overlapping scene transitions (rapid Prev/Next clicks):
  // an async applyScene bails as soon as a newer one starts.
  const sceneGenRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Apply the cinematic state for a scene index. Indexed in lockstep with
  // HEMOGLOBIN_SCENES.
  const applyScene = useCallback(async (idx: number) => {
    const plugin = pluginRef.current;
    const ctx = ctxRef.current;
    if (!plugin || !ctx) return;

    const gen = ++sceneGenRef.current;

    // Tear down the previous scene's transient cinematics.
    plugin.managers.animation.stop();
    plugin.managers.interactivity.lociHighlights.clearHighlights();
    await clearLabels(plugin, ctx);
    if (gen !== sceneGenRef.current) return;

    if (idx <= 0) {
      // Scene 0 — the whole molecule at rest: the full protein and its four
      // hemes. Hide the morph pocket so chain A's heme isn't drawn twice
      // (the pocket overlaps it exactly at frame 0); bring the protein hemes
      // back if we're returning from the binding scene.
      setSubtreeVisibility(plugin.state.data, ctx.morph.structure.ref, true);
      setProteinHemesVisible(plugin, ctx, true);
      await setProteinAlpha(plugin, ctx, 1);
      await setMorphFrame(plugin, ctx, 0);
      if (gen !== sceneGenRef.current) return;
      plugin.managers.camera.reset(undefined, 800);
      return;
    }

    // Scene 1 — fade the protein to a ghost and hide its hemes (so chain A's
    // heme doesn't ghost over the morph), reveal the heme pocket, fly in, and
    // watch O₂ bind.
    setSubtreeVisibility(plugin.state.data, ctx.morph.structure.ref, false);
    setProteinHemesVisible(plugin, ctx, false);
    await setProteinAlpha(plugin, ctx, 0.12);
    if (gen !== sceneGenRef.current) return;

    const feLoci = ironLociOf(ctx.morph.structure);
    plugin.managers.camera.focusLoci(feLoci, { durationMs: 1200, extraRadius: 10 });
    await addLabel(plugin, ctx, feLoci, "Fe²⁺ + O₂");
    if (gen !== sceneGenRef.current) return;

    // TODO(perf): playback feels low-FPS — needs measuring before optimizing.
    // Likely culprits: AnimateModelIndex rebuilds the morph structure every
    // frame, and the whole canvas re-renders through the costly villin
    // postprocessing (32-sample ambient occlusion + outline) over the full
    // protein each tick. Options to explore: drop AO/outline quality during
    // playback, bake fewer morph frames, or limit re-render to the morph.
    //
    // Palindrome: the heme tightens then relaxes on a loop — a fair picture of
    // reversible O₂ binding. (Stopped when the scene changes.)
    plugin.managers.animation.play(AnimateModelIndex, {
      mode: { name: "palindrome", params: {} },
      duration: { name: "fixed", params: { durationInS: 4 } },
    });
  }, []);

  // Mount: spin up the engine, apply the look, load both structures once.
  useEffect(() => {
    let disposed = false;

    async function loadStructure(
      plugin: PluginUIContext,
      spec: StructureSpec
    ): Promise<LoadedStructure> {
      const data = await plugin.builders.data.download(
        { url: spec.url, isBinary: false },
        { state: { isGhost: true } }
      );
      const trajectory = await plugin.builders.structure.parseTrajectory(
        data,
        "pdb"
      );
      const frameCount = trajectory.data?.frameCount ?? 1;
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);
      const refs = await STYLES[spec.style](plugin, structure, spec.colorTheme);
      return { structure, modelRef: model.ref, frameCount, refs };
    }

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

      const protein = await loadStructure(plugin, PROTEIN);
      const morph = await loadStructure(plugin, MORPH);

      if (disposed) {
        plugin.dispose();
        return;
      }
      ctxRef.current = { protein, morph, labelRefs: [] };
      setReady(true);
    }

    init();

    return () => {
      disposed = true;
      pluginRef.current?.dispose();
      pluginRef.current = null;
      ctxRef.current = null;
    };
  }, []);

  // Apply the scene on first ready and whenever the step changes.
  useEffect(() => {
    if (!ready) return;
    applyScene(scene);
  }, [ready, scene, applyScene]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
