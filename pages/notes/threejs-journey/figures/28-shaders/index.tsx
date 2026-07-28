import CodeSandbox from "../CodeSandbox";
import {
  indexHtmlFile,
  indexJsFile,
  stylesCssFile,
  vertexGlslFile,
  fragmentGlslFile,
} from "./sandbox-files";
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
  return <CodeSandbox files={files} />;
};

export default ShadersCodeSandbox;
