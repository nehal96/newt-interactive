import Head from "next/head";
import "../styles/globals.css";
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
      </Head>
      <TooltipProvider delayDuration={300}>
        <Component {...pageProps} />
      </TooltipProvider>
    </>
  );
}

export default MyApp;
