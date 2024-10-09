const withTM = require("next-transpile-modules")([
  "@codesandbox/sandpack-react",
]);
const withMDX = require("@next/mdx")();

module.exports = withTM(
  withMDX({
    // Configure `pageExtensions` to include MDX files
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  })
);
