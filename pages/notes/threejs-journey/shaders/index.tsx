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
import ShaderPatternsCodeSandbox from "../../../../interactives/notes/threejs-journey/29-shader-patterns";
import { shaderPatterns } from "../../../../interactives/notes/threejs-journey/29-shader-patterns/shader-patterns";
import {
  indexHtmlFile,
  indexJsFile,
  stylesCssFile,
  vertexGlslFile,
  fragmentGlslFile,
} from "../../../../interactives/notes/threejs-journey/28-shaders";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import { FiChevronDown } from "react-icons/fi";
import styles from "./shaders.module.css";

const ShadersPage = () => {
  const [selectedShaderPattern, setSelectedShaderPattern] = useState(
    shaderPatterns[0]
  );

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
        <Subheader className="mt-20">29 &mdash; Shader patterns</Subheader>
        <Menu>
          <MenuButton className="p-4 border border-slate-300 rounded-t-md max-w-sm inline-flex text-base items-center mb-4">
            {selectedShaderPattern.name}
            <span>
              <FiChevronDown className="ml-1" />
            </span>
          </MenuButton>
          <MenuList className="rounded-b-md w-64">
            {shaderPatterns.map((pattern) => (
              <MenuItem
                className={styles["menu-item"]}
                key={pattern.name}
                onSelect={() => setSelectedShaderPattern(pattern)}
              >
                {pattern.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <ShaderPatternsCodeSandbox shaderPattern={selectedShaderPattern} />
      </ArticleContainer>
    </>
  );
};

export default ShadersPage;
