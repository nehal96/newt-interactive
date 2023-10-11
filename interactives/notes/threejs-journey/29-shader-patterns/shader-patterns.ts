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
  {
    name: "Pattern 3",
    code: `float strength = vUv.x;
  
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 4",
    code: `float strength = vUv.y;
  
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 5",
    code: `float strength = 1.0 - vUv.y;
  
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 6",
    code: `float strength = vUv.y * 10.0;
  
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 7",
    code: `float strength = mod(vUv.y * 10.0, 1.0);
  
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 8",
    code: `float strength = mod(vUv.y * 10.0, 1.0);
  strength = step(0.5, strength);

  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 9",
    code: `float strength = mod(vUv.y * 10.0, 1.0);
  strength = step(0.8, strength);
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 10",
    code: `float strength = mod(vUv.x * 10.0, 1.0);
  strength = step(0.8, strength);
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 11",
    code: `float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 12",
    code: `float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 13",
    code: `float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 14",
    code: `float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
  float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
  float strength = barX + barY;
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 15",
    code: `float barX = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  barX *= step(0.4, mod(vUv.y * 10.0, 1.0));
  
  float barY = step(0.4, mod(vUv.x * 10.0, 1.0));
  barY *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
  
  float strength = barX + barY;
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
  {
    name: "Pattern 16",
    code: `float strength = abs(vUv.x - 0.5);
    
  gl_FragColor = vec4(vec3(strength), 1.0);`,
  },
];
