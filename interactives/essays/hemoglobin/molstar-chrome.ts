// Shared Mol* chrome config for the hemoglobin 3D viewers. The goal is a clean,
// figure-like canvas: no built-in viewport buttons, no panels — keeping only the
// camera-orientation axes gizmo (a canvas overlay, not one of the buttons).
//
// `layout.showControls:false` already hides the left/top panels, but Mol* still
// floats a viewport-control cluster over the top-right corner (reset zoom,
// screenshot, expand, settings, selection mode, …). Those are each gated by a
// PluginConfig.Viewport flag, so turning every flag off removes the whole
// cluster while leaving the canvas (and the axes gizmo) untouched.
//
// Imported by the client-only viewers (MolstarViewer, anatomy/MoleculeViewer,
// catching/MorphPlayer); molstar only loads in the browser via their dynamic
// ssr:false imports, so importing it here is safe.
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PluginConfig, type PluginConfigItem } from "molstar/lib/mol-plugin/config";
import { CameraHelperParams } from "molstar/lib/mol-canvas3d/helper/camera-helper";

// Every Mol* viewport-overlay button, switched off. Passed as the plugin spec's
// `config`; the canvas keeps rendering, just without the floating chrome.
export const VIEWPORT_CHROME_OFF: [PluginConfigItem, unknown][] = [
  [PluginConfig.Viewport.ShowReset, false],
  [PluginConfig.Viewport.ShowExpand, false],
  [PluginConfig.Viewport.ShowToggleFullscreen, false],
  [PluginConfig.Viewport.ShowControls, false],
  [PluginConfig.Viewport.ShowSettings, false],
  [PluginConfig.Viewport.ShowSelectionMode, false],
  [PluginConfig.Viewport.ShowAnimation, false],
  [PluginConfig.Viewport.ShowTrajectoryControls, false],
  [PluginConfig.Viewport.ShowScreenshotControls, false],
  [PluginConfig.Viewport.ShowIllumination, false],
  [PluginConfig.Viewport.ShowXR, "off"],
];

// Build the *complete* "on" params for a Mol* Mapped param, then layer overrides
// on top. Passing a partial params object to setProps drops nested sub-params
// (e.g. occlusion's `multiScale`), which later crashes the render pass with
// "Cannot read properties of undefined (reading 'name')". Lives here, the
// lowest-level shared module, so the engine and the viewers all reuse one copy.
export function onWith(mapped: any, overrides: Record<string, unknown> = {}) {
  const variant = mapped.map("on");
  const defaults = PD.getDefaultValues(variant.params ?? variant);
  return { name: "on" as const, params: { ...defaults, ...overrides } };
}

// The camera-orientation axes gizmo, kept on at its default bottom-left corner —
// the one bit of viewport chrome we keep. Spread into canvas3d setProps as
// `{ camera: { helper: { axes: AXES_GIZMO } } }`.
export const AXES_GIZMO = onWith(CameraHelperParams.axes, { location: "bottom-left" });
