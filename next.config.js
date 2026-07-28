const withMDX = require("@next/mdx")();

module.exports = withMDX({
  // Only `*.page.*` is a route, so a piece's figures can live in its route folder.
  pageExtensions: ["page.js", "page.jsx", "page.mdx", "page.ts", "page.tsx"],
});
