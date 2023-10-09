import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import indexHtmlFile from "./indexhtml-file";
import stylesCssFile from "./stylescss-file";
import indexJsFile from "./indexjs-file";
import vertexGlslFile from "./vertexglsl-file";
import fragmentGlslFile from "./fragmentglsl-file";

const ShaderPatternsCodeSandbox = ({ shaderPattern }) => {
  const files = {
    "/index.html": {
      code: indexHtmlFile(),
      hidden: true,
    },
    "/index.js": indexJsFile(
      `${vertexGlslFile()}`,
      fragmentGlslFile(shaderPattern)
    ),
    "/styles.css": {
      code: stylesCssFile(),
      hidden: true,
    },
    "/vertex.glsl": vertexGlslFile(),
    "/fragment.glsl": {
      code: fragmentGlslFile(shaderPattern),
      active: true,
    },
  };

  return (
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
  );
};

export default ShaderPatternsCodeSandbox;
