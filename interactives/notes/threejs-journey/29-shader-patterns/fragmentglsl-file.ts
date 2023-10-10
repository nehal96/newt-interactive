import { ShaderPattern } from "./shader-patterns";

const fragmentGlslFile = (shader: ShaderPattern) => {
  const comment = `// ${shader.name}`;
  const fragmentCode =
    shader?.code || `gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);`;

  return `varying vec2 vUv;

void main() {
  ${comment}
  ${fragmentCode}
}
`;
};

export default fragmentGlslFile;
