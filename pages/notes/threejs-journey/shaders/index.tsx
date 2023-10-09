import Head from "next/head";
import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Subheader,
  Title,
} from "../../../../components";
import {
  indexHtmlFile,
  indexJsFile,
  stylesCssFile,
  vertexGlslFile,
  fragmentGlslFile,
} from "../../../../interactives/notes/threejs-journey/28-shaders";

const ShadersPage = () => {
  const files = {
    "/index.html": {
      code: indexHtmlFile(),
      hidden: true,
    },
    "/index.js": indexJsFile(`${vertexGlslFile()}`, fragmentGlslFile()),
    "/styles.css": {
      code: stylesCssFile(),
      hidden: true,
    },
    "/vertex.glsl": vertexGlslFile(),
    "/fragment.glsl": fragmentGlslFile(),
  };

  return (
    <>
      <Head>
        <title>ThreeJS Journey Notes / Newt Interactive</title>
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
        <Title>ThreeJS Journey Notes</Title>
        <Lede>
          Random stuff from Bruno Simon's course,{" "}
          <a
            href="https://threejs-journey.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-slate-600 hover:text-slate-700 underline underline-offset-1 decoration-slate-700"
          >
            ThreeJS Journey
          </a>
        </Lede>
        <Subheader>28 &mdash; Shaders</Subheader>
        <Paragraph>Shaders</Paragraph>
        <Sandpack
          files={files}
          theme={atomDark}
          template="vanilla"
          options={{
            showLineNumbers: true,
            editorHeight: 500,
          }}
          customSetup={{
            dependencies: {
              three: "0.151.3",
            },
            devDependencies: {
              "@babel/core": "7.2.0",
              "parcel-bundler": "^1.6.1",
            },
            entry: "index.html",
          }}
        />
      </ArticleContainer>
    </>
  );
};

export default ShadersPage;
