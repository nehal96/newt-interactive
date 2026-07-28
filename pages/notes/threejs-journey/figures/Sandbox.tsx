import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import type { SandpackFiles } from "@codesandbox/sandpack-react";

// No import of this module outside CodeSandbox's dynamic() — it is what puts
// Sandpack in a chunk of its own.
export default function Sandbox({ files }: { files: SandpackFiles }) {
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
}
