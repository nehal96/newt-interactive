export type ShaderPattern = {
  name: string;
  code: string;
};
export type ShaderPatterns = ShaderPattern[];

export const shaderPatterns: ShaderPatterns = [
  {
    name: "Pattern 0",
    code: `gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);`,
  },
  {
    name: "Pattern 1",
    code: `gl_FragColor = vec4(vUv, 1.0, 1.0);`,
  },
  {
    name: "Pattern 2",
    code: `gl_FragColor = vec4(vUv, 0.0, 1.0);`,
  },
];
