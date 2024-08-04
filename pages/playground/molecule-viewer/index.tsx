import Head from "next/head";
import { useEffect, createRef } from "react";
import {
  DefaultPluginUISpec,
  PluginUISpec,
} from "molstar/lib/mol-plugin-ui/spec";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { Structure } from "molstar/lib/mol-model/structure";
import { ArticleContainer, Navbar } from "../../../components";
import "./molecule-viewer.module.css";

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}

const mySpec: PluginUISpec = {
  ...DefaultPluginUISpec(),
  config: [
    [PluginConfig.VolumeStreaming.Enabled, false],
    // [PluginConfig.Viewport.ShowExpand, false],
    // [PluginConfig.Viewport.ShowControls, false],
    // [PluginConfig.Viewport.ShowSettings, false],
    // [PluginConfig.Viewport.ShowSelectionMode, false],
    // [PluginConfig.Viewport.ShowTrajectoryControls, false],
    // [PluginConfig.Viewport.ShowAnimation, false],
  ],
};

export function MolStarWrapper() {
  const parent = createRef<HTMLDivElement>();

  // In debug mode of react's strict mode, this code will
  // be called twice in a row, which might result in unexpected behavior.
  useEffect(() => {
    async function init() {
      window.molstar = await createPluginUI({
        target: parent.current as HTMLDivElement,
        render: renderReact18,
        spec: mySpec,
      });

      const data = await window.molstar.builders.data.download(
        {
          url: "https://files.rcsb.org/download/4TNA.pdb",
        } /* replace with your URL */,
        { state: { isGhost: true } }
      );
      const trajectory =
        await window.molstar.builders.structure.parseTrajectory(data, "pdb");
      await window.molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );
    }
    init();

    // window.molstar?.behaviors.interaction.click.subscribe((event) => {
    //   const selections = Array.from(
    //     window.molstar.managers.structure.selection.entries.values()
    //   );

    //   for (const { structure } of selections) {
    //     console.log("structure: ", structure);
    //   }
    // });

    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, []);

  return (
    <div
      ref={parent}
      id="molstar-container"
      style={{ width: 640, height: 480 }}
    />
  );
}

const MoleculeViewerPage = () => {
  const onClick = () => {
    const ligandData =
      window.molstar.managers.structure.hierarchy.selection.structures[0]
        .components[1]?.cell.obj?.data;
    const ligandLoci = Structure.toStructureElementLoci(ligandData);

    window.molstar.managers.camera.focusLoci(ligandLoci);
    window.molstar.managers.interactivity.lociSelects.select({
      loci: ligandLoci,
    });

    const mol = window.molstar.managers.structure.hierarchy;

    console.log("mol", mol);
  };

  return (
    <>
      <Head>
        <title>Molecule Viewer / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/notes/threejs-journey"
        />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:title"
          content="ThreeJS Journey Notes / Newt Interactive"
        />
        <meta
          property="twitter:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <MolStarWrapper />
        <button
          onClick={onClick}
          className="p-2 border-black border-solid border rounded"
          style={{ position: "absolute", zIndex: 10000, bottom: 10, right: 10 }}
        >
          focus
        </button>
      </ArticleContainer>
    </>
  );
};

export default MoleculeViewerPage;
