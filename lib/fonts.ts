/* Every webfont the site uses, self-hosted by next/font.
 *
 * This used to be one `@import url("https://fonts.googleapis.com/css2?...")` in
 * styles/fonts.css. Two things were wrong with that, one of them fatal:
 *
 *   - Turbopack — what `next dev` runs on as of Next 16 — drops external
 *     `@import url()` rules on the floor. styles/fonts.css compiled to an empty
 *     block, no woff2 was ever requested, and every face fell back to a system
 *     font. So the site was untyped on localhost while production, which builds
 *     on webpack, looked fine. Same bundler split as the `ssr: false` bug in
 *     the build notes, biting from the other side.
 *   - Even where it worked it was the slowest way to ask: a CSS @import is
 *     invisible to the browser's preload scanner, so first paint waited on a
 *     round trip to fonts.googleapis.com before the woff2s were even known
 *     about.
 *
 * next/font downloads the files at build time and serves them from our own
 * origin, so there is no Google request left to be slow — and no third party in
 * front of first paint. It also generates a size-adjusted local fallback per
 * family, so the swap doesn't reflow the page under it.
 *
 * Each face exports a CSS variable named for its Tailwind key, so
 * `fontFamily.title` in tailwind.config.js is just `var(--font-title)`. Add a
 * face by adding a loader here and a key there — there is no URL to extend any
 * more.
 *
 * `preload` is the one thing worth thinking about per face. next/font emits a
 * `<link rel="preload">` for every font imported by the page, and this module
 * is imported by _document, i.e. by every page. That's right for the faces the
 * chrome itself uses and wasteful for the two that appear inside one component
 * each — those are `preload: false`, which still loads them on demand wherever
 * they're actually used, the way the old @import did for everything.
 */
import {
  Bebas_Neue,
  DM_Serif_Display,
  Fira_Mono,
  Inter,
  Libre_Baskerville,
  Righteous,
} from "next/font/google";

// The interface sans: standfirst, index metadata, subtitles, the footer. Now a
// variable font, so the 400–500 range the site uses is one file rather than two.
const ui = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

// Titles — the article header and every index row.
const title = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-title",
});

// The index's kind labels and every code block. prism-one-dark.css asks for
// this through the variable rather than by name: next/font gives the family a
// hashed name, so a literal "Fira Mono" there would fall through to Menlo.
const mono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

// The wordmark. In the navbar, so on every page.
const logo = Righteous({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-logo",
});

// Pull quotes. Variable, and italic comes along for an <em> inside one.
const quote = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-quote",
  preload: false,
});

// Display caps, used by exactly one figure — circuit-evolution's Evangelion
// theme. Not worth a preload on every other page.
const evangelion = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-evangelion",
  preload: false,
});

/** Every font variable, for the root element in _document. */
export const fontVariables = [ui, title, mono, logo, quote, evangelion]
  .map((font) => font.variable)
  .join(" ");
