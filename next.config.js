const withTM = require("next-transpile-modules")([
  "@codesandbox/sandpack-react",
  "molstar",
]);

module.exports = withTM({
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
