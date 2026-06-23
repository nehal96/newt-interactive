const withMDX = require("@next/mdx")();

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // @react-three/drei's barrel pulls in three-mesh-bvh, which references
    // `BatchedMesh` — a `three` export added in r159 but absent from our pinned
    // three@0.139.2. The symbol isn't exercised by the OrbitControls path we
    // actually use, but webpack's exports-presence check fails the production
    // build over it. Relax that check *only* for three-mesh-bvh so the build can
    // complete while the rest of the project still fails on real missing-export
    // bugs. (Removing this means upgrading three ≥ r159 — see TODO.md.)
    // Matches both the top-level copy and drei's nested
    // @react-three/drei/node_modules/three-mesh-bvh. Rule-level parser options
    // are applied un-namespaced (the `javascript` key is only for the global
    // `module.parser`).
    config.module.rules.push({
      test: /[\\/]three-mesh-bvh[\\/]/,
      parser: { exportsPresence: false },
    });
    return config;
  },
});
