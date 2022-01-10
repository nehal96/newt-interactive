import Head from "next/head";
import "../styles/globals.css";

<a href="https://ibb.co/5vdjmk8"><img src="" alt="Meta-tag-image-1" border="0"></a><br /><a target='_blank' href='https://imgbb.com/'>private image upload</a><br />

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.newtinteractive.com/" />
        <meta property="og:title" content="Newt Interactive" />
        <meta
          property="og:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta property="og:image" content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png" />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/"
        />
        <meta property="twitter:title" content="Newt Interactive" />
        <meta
          property="twitter:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta property="twitter:image" content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
