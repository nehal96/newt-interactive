import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
// Not unused, and not movable into _document. next/font emits its @font-face
// rules and its `--font-*` definitions into the chunk of whatever *page* module
// imports it, and _document isn't one of those — importing it only there gets
// you the class names with no CSS behind them, which is a site with no webfonts
// and nothing in the console about it. So the CSS is pulled in here, and
// _document puts the matching classes on <html>. Both halves are required.
import "../lib/fonts";
import { useEffect } from "react";
import { TooltipProvider } from "../components";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const updateDocumentProperties = () => {
      document.documentElement.style.setProperty(
        "--document-width",
        `${window.innerWidth}px`
      );
    };

    updateDocumentProperties();
    document.documentElement.style.setProperty(
      "--gutter-size",
      `max(20px, calc((var(--document-width) - 64rem) / 2))`
    );

    window.addEventListener("resize", updateDocumentProperties);

    return () => window.removeEventListener("resize", updateDocumentProperties);
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#818cf8" />
      </Head>
      <TooltipProvider delayDuration={300}>
        <Component {...pageProps} />
        <Analytics />
      </TooltipProvider>
    </>
  );
}

export default MyApp;
