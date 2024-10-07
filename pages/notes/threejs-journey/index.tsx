import Head from "next/head";
import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import * as Select from "@radix-ui/react-select";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Subheader,
  Title,
} from "../../../components";
import {
  AnimationsSection,
  CamerasSection,
} from "../../../interactives/notes/threejs-journey";
import {
  indexHtmlFile,
  indexJsFile,
  stylesCssFile,
  vertexGlslFile,
  fragmentGlslFile,
} from "../../../interactives/notes/threejs-journey/28-shaders";
import { shaderPatterns } from "../../../interactives/notes/threejs-journey/29-shader-patterns/shader-patterns";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import ShaderPatternsCodeSandbox from "../../../interactives/notes/threejs-journey/29-shader-patterns";
import { useState } from "react";

const ThreeJSJourneyPage = () => {
  const [selectedShaderPattern, setSelectedShaderPattern] = useState(
    shaderPatterns[0]
  );
  const onValueChange = (patternName) => {
    const patternObj = _.find(shaderPatterns, (pattern) => {
      return patternName === pattern.name;
    });

    setSelectedShaderPattern(patternObj);
  };

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
          content="Interactive, educational explainers and playgrounds on topics from Bruno Simon's ThreeJS Journey course, including animations, cameras, shaders, and more."
        />
        <meta
          name="keywords"
          content="ThreeJS, 3D graphics, web development, animations, cameras, shaders, interactive learning"
        />
        <meta
          property="og:title"
          content="ThreeJS Journey Notes / Newt Interactive"
        />
        <meta
          property="og:description"
          content="Interactive, educational explainers and playgrounds on topics from Bruno Simon's ThreeJS Journey course, including animations, cameras, shaders, and more."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta
          property="og:url"
          content="https://www.newtinteractive.com/notes/threejs-journey"
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ThreeJS Journey Notes / Newt Interactive"
        />
        <meta
          name="twitter:description"
          content="Learn about ThreeJS concepts with interactive examples and playgrounds."
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta name="twitter:creator" content="@nehaludyavar" />
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
        <Subheader>06 &mdash; Animations</Subheader>
        <Paragraph>
          Animations in Three.js work like stop motion &mdash; each time an
          object moves, you render the changes. Take a look at a few ways you
          can animate a yellow box below:
        </Paragraph>
        <AnimationsSection />
        <Subheader className="mt-16">07 &mdash; Cameras</Subheader>
        <Paragraph>
          A camera is, as you can imagine, what you use to see the scene in
          Three.js.
        </Paragraph>
        <CamerasSection />
        <Subheader className="mt-16">28 &mdash; Shaders</Subheader>
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
        <Select.Root
          value={selectedShaderPattern.name}
          onValueChange={onValueChange}
        >
          <Select.Trigger className="inline-flex leading-none rounded data-[placeholder]:text-slate-600 outline-none text-sm py-1">
            <Select.Value aria-label={selectedShaderPattern.name}>
              {selectedShaderPattern.name}
            </Select.Value>
            <Select.Icon>
              <FiChevronDown className="ml-1" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
            >
              <Select.Viewport className="p-[5px]">
                {shaderPatterns.map((pattern) => (
                  <Select.Item
                    className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                    value={pattern.name}
                  >
                    <Select.ItemText>{pattern.name}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <FiCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <ShaderPatternsCodeSandbox shaderPattern={selectedShaderPattern} />
      </ArticleContainer>
    </>
  );
};

export default ThreeJSJourneyPage;
