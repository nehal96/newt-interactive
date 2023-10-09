import { shaderPatterns } from "./shader-patterns";

const fragmentGlslFile = (patternNumber: number) => {
  const fragmentCode =
    shaderPatterns[patternNumber]?.code ||
    `gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);`;

  return `varying vec2 vUv;

void main() {
  ${fragmentCode}
}
`;
};

export default fragmentGlslFile;
