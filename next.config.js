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
    // actually use, so downgrade the missing-export hard error to a warning so
    // the production (webpack) build can complete.
    config.module.parser = config.module.parser || {};
    config.module.parser.javascript = {
      ...(config.module.parser.javascript || {}),
      exportsPresence: false,
    };
    return config;
  },
});
