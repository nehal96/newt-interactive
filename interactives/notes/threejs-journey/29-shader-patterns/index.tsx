import { useState } from "react";
import * as _ from "lodash";
import * as Select from "@radix-ui/react-select";
import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import indexHtmlFile from "./indexhtml-file";
import stylesCssFile from "./stylescss-file";
import indexJsFile from "./indexjs-file";
import vertexGlslFile from "./vertexglsl-file";
import fragmentGlslFile from "./fragmentglsl-file";
import { shaderPatterns } from "./shader-patterns";

const ShaderPatternsCodeSandbox = () => {
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
    "/index.js": indexJsFile(
      `${vertexGlslFile()}`,
      fragmentGlslFile(selectedShaderPattern)
    ),
    "/styles.css": {
      code: stylesCssFile(),
      hidden: true,
    },
    "/vertex.glsl": vertexGlslFile(),
    "/fragment.glsl": {
      code: fragmentGlslFile(selectedShaderPattern),
      active: true,
    },
  };

  return (
    <>
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
    </>
  );
};

export default ShaderPatternsCodeSandbox;
