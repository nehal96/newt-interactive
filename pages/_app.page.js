import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
// Not unused: next/font emits its @font-face rules into the chunk of whatever
// *page* module imports it, and _document isn't one.
import "@lib/fonts";
import { useEffect } from "react";
// Deep import, never the barrel — whatever _app reaches ships on every route.
import { TooltipProvider } from "@ui/controls/Tooltip";

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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Newt Interactive"
          href="/feed.xml"
        />
        {/* Must equal Tailwind's glass.pane — Safari tints its overscroll
            strip with this, and drift shows as a band above the navbar. */}
        <meta name="theme-color" content="#EBE9F9" />
      </Head>
      <TooltipProvider delayDuration={300}>
        <Component {...pageProps} />
        <Analytics />
      </TooltipProvider>
    </>
  );
}

export default MyApp;
