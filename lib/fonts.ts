/* Every webfont the site uses, self-hosted by next/font. */
import {
  Bebas_Neue,
  DM_Serif_Display,
  Fira_Mono,
  Inter,
  Libre_Baskerville,
  Righteous,
} from "next/font/google";

const ui = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

const title = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-title",
});

const mono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const logo = Righteous({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-logo",
});

// `preload: false` — every face loaded here is otherwise preloaded on every page.
const quote = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-quote",
  preload: false,
});

const evangelion = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-evangelion",
  preload: false,
});

export const fontVariables = [ui, title, mono, logo, quote, evangelion]
  .map((font) => font.variable)
  .join(" ");
