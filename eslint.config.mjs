import tsParser from "@typescript-eslint/parser";

/**
 * Imports point one way only: a piece → viz → ui → lib. Nothing below reaches
 * up. These are the rules the layer split exists to make true; without them
 * the next barrel-in-_app regression is invisible until a bundle grows.
 */

const languageOptions = {
  parser: tsParser,
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
};

const deny = (patterns) => ({
  "no-restricted-imports": ["error", { patterns }],
});

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "docs/**",
      "**/*.mdx",
    ],
  },

  // lib is the floor: pure TypeScript, no React, no layers above it.
  // lib/content.ts is the one exception — a catalogue indexes pieces by
  // definition, and a meta.ts is plain data that costs nothing to import.
  {
    files: ["lib/**/*.ts"],
    ignores: ["lib/content.ts"],
    languageOptions,
    rules: deny([
      { group: ["@ui/*", "@viz/*"], message: "lib is below ui and viz." },
      { group: ["**/pages/**"], message: "lib cannot import a piece." },
    ]),
  },

  // ui knows nothing about figures or pieces.
  {
    files: ["ui/**/*.{ts,tsx}"],
    languageOptions,
    rules: deny([
      { group: ["@viz/*"], message: "ui is below viz." },
      { group: ["**/pages/**"], message: "ui cannot import a piece." },
    ]),
  },

  // viz builds figures; it never reaches into the pieces that use them.
  {
    files: ["viz/**/*.{ts,tsx}"],
    languageOptions,
    rules: deny([
      { group: ["**/pages/**"], message: "viz cannot import a piece." },
    ]),
  },

  // Whatever _app reaches ships on every route, so it deep-imports only.
  // `paths` matches the exact specifier; `patterns` would also catch the
  // deep import this rule exists to permit.
  {
    files: ["pages/_app.page.{js,tsx}"],
    languageOptions,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            "@ui/controls",
            "@ui/prose",
            "@ui/layout",
            "@ui/article",
            "@ui/site",
            "@viz/flow",
            "@viz/slides",
            "@viz/chart",
          ].map((name) => ({
            name,
            message:
              "_app must deep-import (@ui/controls/Tooltip), never a barrel — it ships on every route.",
          })),
        },
      ],
    },
  },

  // A piece owns its figures; another piece's are private to it. Pieces still
  // living in interactives/ only warn, so `check` stays green while the
  // remaining migration list stays visible.
  {
    files: ["pages/**/*.{ts,tsx}"],
    languageOptions,
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["../../**/figures", "../../**/figures/**"],
              message: "Another piece's figures are private to it.",
            },
            {
              group: ["**/interactives/**"],
              message:
                "Not yet colocated — move these figures into the piece's folder.",
            },
          ],
        },
      ],
    },
  },
];
