import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
// Not unused: next/font emits its @font-face rules into the chunk of whatever
// *page* module imports it, and _document isn't one.
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
