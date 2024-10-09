import { Sandpack } from "@codesandbox/sandpack-react";
import {
  indexHtmlFile,
  indexJsFile,
  stylesCssFile,
  vertexGlslFile,
  fragmentGlslFile,
} from "./sandbox-files";
import { atomDark } from "@codesandbox/sandpack-themes";
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

const ShadersCodeSandbox = () => {
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

export default ShadersCodeSandbox;
