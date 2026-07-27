import { Html, Head, Main, NextScript } from "next/document";

import { fontVariables } from "../lib/fonts";

/* The document shell. It exists for one reason: the font variables have to land
 * on <html>, and that's the one element _app can't reach. Everything below
 * <body> is still _app's job.
 *
 * It has to be <html> rather than a wrapper _app could render, because the
 * Radix primitives — Dialog, Popover, Sheet, the tooltips — portal their
 * content to <body>. Anything inside a wrapper would leave every portalled
 * layer outside the scope the variables are defined on, so the site's own type
 * would be right and every dialog would silently fall back.
 *
 * The other half of this lives in _app: next/font only emits the CSS behind
 * these class names for a module a page imports, and _document isn't one. See
 * the note on the import there.
 *
 * `lang` belongs on this element too, and there was nowhere to put it before. */
export default function Document() {
  return (
    <Html lang="en" className={fontVariables}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
