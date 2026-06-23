import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { Vec3 } from "molstar/lib/mol-math/linear-algebra";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import {
  IRON_EXPR,
  useMolstarViewer,
  type LoadedStructure,
} from "../molstar-engine";
import { HB, toHex } from "../palette";

// A lightweight, self-contained Mol* viewer for the *anatomy* build-up: load one
// small vendored structure and show it with the shared "villin look", framed and
// static. Each anatomy beat is its own block, so this only loads what it needs.
// All the engine machinery (boot, look, idling, teardown) lives in
// ../molstar-engine; this file owns only the anatomy-specific selections, the
// fixed-camera override, and which representations to draw.

// Iron's emphasis color (matches the SVG sphere + the iron beat's spacefill).
const FE_EMPHASIS_COLOR = toHex(HB.iron.fill);

// MolScript: an OR over a set of author chain ids — the shared chain filter.
const chainTest = (chains: string[]) =>
  MS.core.logic.or(chains.map((c) => MS.core.rel.eq([MS.ammp("auth_asym_id"), c])));

// Atoms in `chains` — drawn as the alpha (A, C) / beta (B, D) cartoon ribbons.
const chainsExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({ "chain-test": chainTest(chains) });

// Proximal/distal His sequence numbers — alpha chains use 58 (distal) / 87
// (proximal), beta chains 63 / 92. Selecting these four across chains A–D picks
// out exactly each chain's two pocket histidines and nothing else.
const POCKET_HIS_SEQ = [58, 63, 87, 92];

// The full heme pockets of `chains` — the heme (HEM; 2HHB also holds PO4/water)
// plus the proximal & distal histidines — so the chain beats build on the
// previous beat's pockets rather than dropping the histidines.
const pocketExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({
    "chain-test": chainTest(chains),
    "residue-test": MS.core.logic.or([
      MS.core.rel.eq([MS.ammp("label_comp_id"), "HEM"]),
      MS.core.logic.and([
        MS.core.rel.eq([MS.ammp("label_comp_id"), "HIS"]),
        MS.core.logic.or(
          POCKET_HIS_SEQ.map((n) => MS.core.rel.eq([MS.ammp("auth_seq_id"), n]))
        ),
      ]),
    ]),
  });

// The heme irons of `chains` — emphasized as fat orange spheres at protein scale.
const ironInChainsExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({
    "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es("Fe")]),
    "chain-test": chainTest(chains),
  });

type ChainGroup = { chains: string[]; color: number };

/** A fixed camera angle (see MoleculeViewerProps.orientation). */
type Orientation = {
  direction: [number, number, number];
  up: [number, number, number];
};

// Adjust the camera on top of Mol*'s auto-fit reset, keeping the reset target so
// the structure stays centered. With `orientation`, rotate to look along
// `direction` with the given `up`; otherwise keep the reset's angle. `zoom` > 1
// pulls the camera closer so the structure fills more of the pane.
function applyCameraView(
  plugin: PluginUIContext,
  orientation: Orientation | undefined,
  zoom: number
) {
  const cam = plugin.canvas3d?.camera;
  if (!cam) return;
  const snap = cam.getSnapshot();
  const dist = Vec3.distance(snap.position, snap.target) / zoom;
  if (orientation) {
    // Camera sits a `dist` back along the look direction from the target.
    const dir = Vec3.normalize(Vec3(), Vec3.create(...orientation.direction));
    const position = Vec3.scaleAndAdd(Vec3(), snap.target, dir, -dist);
    const up = Vec3.normalize(Vec3(), Vec3.create(...orientation.up));
    cam.setState({ ...snap, position, up }, 0);
  } else {
    // Keep the reset angle, just move the camera in/out along its own axis.
    const dir = Vec3.normalize(Vec3(), Vec3.sub(Vec3(), snap.position, snap.target));
    const position = Vec3.scaleAndAdd(Vec3(), snap.target, dir, dist);
    cam.setState({ ...snap, position }, 0);
  }
}

export type MoleculeViewerProps = {
  /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
  url: string;
  representation?: "spacefill" | "ball-and-stick" | "cartoon";
  /** If set, color uniformly with this hex; otherwise color by element. */
  uniformColor?: number;
  sizeFactor?: number;
  /**
   * Overlay the iron atom(s) as a larger orange sphere so the Fe stays the
   * visual star — keeps a ball-and-stick ring readable while matching the
   * spacefill iron of the iron beat / the SVG diagram.
   */
  emphasizeIron?: boolean;
  /**
   * Draw only these chain groups as cartoon ribbons, one uniform color each
   * (the alpha/beta chain beats). When set, this replaces the whole-structure
   * representation: chains in no group simply aren't drawn.
   */
  chainGroups?: ChainGroup[];
  /**
   * With `chainGroups`, also draw the shown chains' full heme pockets (heme +
   * proximal/distal His + emphasized Fe), matching the previous beat.
   */
  showPockets?: boolean;
  /** Chains whose pockets to draw; defaults to the ribbon (`chainGroups`) chains. */
  pocketChains?: string[];
  /**
   * Fixed camera angle. When set, the auto-fit framing is kept (centered, sized
   * to the pane) but the camera is rotated to look along `direction` with the
   * given `up` roll, instead of Mol*'s default principal-axis orientation.
   */
  orientation?: Orientation;
  /**
   * Zoom factor applied after the auto-fit reset; >1 pulls the camera closer so
   * the structure fills more of the pane. Defaults to 1.
   */
  zoom?: number;
  /**
   * Whether the viewer is on-screen. When false the render loop is paused so an
   * off-screen viewer costs nothing; the WebGL context is kept so scrolling back
   * is instant (no re-boot). Defaults to true.
   */
  active?: boolean;
  className?: string;
};

export default function MoleculeViewer({
  url,
  representation = "spacefill",
  uniformColor,
  sizeFactor,
  emphasizeIron = false,
  chainGroups,
  showPockets = false,
  pocketChains,
  orientation,
  zoom = 1,
  active = true,
  className,
}: MoleculeViewerProps) {
  // Add this beat's representations to the freshly loaded structure, then lock
  // the fixed angle / zoom on top of Mol*'s auto-fit.
  const build = async (plugin: PluginUIContext, { structure }: LoadedStructure) => {
    const rep = plugin.builders.structure.representation;
    const comp = plugin.builders.structure;

    if (chainGroups && chainGroups.length > 0) {
      // Chain beats: one uniformly-colored cartoon ribbon per chain group,
      // colored by type from the shared palette (α blue, β magenta). Chains in
      // no group aren't drawn.
      for (const group of chainGroups) {
        const c = await comp.tryCreateComponentFromExpression(
          structure,
          chainsExpr(group.chains),
          `chains-${group.chains.join("")}`
        );
        if (c) {
          await rep.addRepresentation(c, {
            type: "cartoon",
            color: "uniform",
            colorParams: { value: group.color },
          } as any);
        }
      }

      // Carry the pockets into the chain beats: each shown chain's heme +
      // proximal/distal His as element-colored ball-and-stick, its Fe
      // emphasized — the same pocket and Fe size as the previous beat, now
      // wrapped by the ribbons.
      if (showPockets) {
        // Pockets can span more chains than the ribbons (the alpha beat shows
        // all four pockets but only the alpha ribbons).
        const pocketSet = pocketChains ?? chainGroups.flatMap((g) => g.chains);
        const pockets = await comp.tryCreateComponentFromExpression(
          structure,
          pocketExpr(pocketSet),
          "chain-pockets"
        );
        if (pockets) {
          await rep.addRepresentation(pockets, {
            type: "ball-and-stick",
            color: "element-symbol",
          } as any);
        }
        const iron = await comp.tryCreateComponentFromExpression(
          structure,
          ironInChainsExpr(pocketSet),
          "chain-iron"
        );
        if (iron) {
          await rep.addRepresentation(iron, {
            type: "spacefill",
            color: "uniform",
            colorParams: { value: FE_EMPHASIS_COLOR },
            // Same Fe size as the build-up pockets (not a fat protein-scale
            // sphere) so the iron reads identically across beats.
            typeParams: { sizeFactor: 0.25 },
          } as any);
        }
      }
    } else {
      const props: Record<string, unknown> = {
        type: representation,
        color: uniformColor != null ? "uniform" : "element-symbol",
      };
      if (uniformColor != null) props.colorParams = { value: uniformColor };
      if (sizeFactor != null) props.typeParams = { sizeFactor };
      await rep.addRepresentation(structure, props as any);

      // Emphasize the iron: a fatter orange sphere on top of the base rep.
      if (emphasizeIron) {
        const iron = await comp.tryCreateComponentFromExpression(
          structure,
          IRON_EXPR,
          "anatomy-iron"
        );
        if (iron) {
          // Size to ~2× the ring atoms (covalent-radius scale). Ball-and-stick
          // balls are vdW × 0.15 (C ≈ 0.255 Å); a spacefill sphere is Fe_vdW
          // (2.05) × sizeFactor, so 0.25 → ≈0.51 Å ≈ 2× the ring balls.
          await rep.addRepresentation(iron, {
            type: "spacefill",
            color: "uniform",
            colorParams: { value: FE_EMPHASIS_COLOR },
            typeParams: { sizeFactor: 0.25 },
          } as any);
        }
      }
    }

    plugin.managers.camera.reset(undefined, 0);
    // `camera.reset` only *requests* the auto-fit; it's resolved later, inside
    // the render loop's commit. Force that commit synchronously so the camera is
    // actually fitted before we read its snapshot — and so no pending reset
    // fires on a later frame and clobbers the override (which is why a
    // distance/zoom change silently snapped back to the auto-fit distance).
    plugin.canvas3d?.commit(true);
    // Lock a fixed angle (e.g. the pyrrole ring face-on) and/or zoom in on top
    // of the now-applied fit, keeping its centering.
    if (orientation || zoom !== 1) applyCameraView(plugin, orientation, zoom);
  };

  const { outerRef, containerRef } = useMolstarViewer({
    url,
    active,
    build,
    deps: [
      url,
      representation,
      uniformColor,
      sizeFactor,
      emphasizeIron,
      chainGroups,
      showPockets,
      pocketChains,
      orientation,
      zoom,
    ],
  });

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // Clip Mol*'s (non-composited) viewport chrome to the rounded corners;
        // the WebGL canvas itself is rounded directly after boot (see engine).
        overflow: "hidden",
      }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
