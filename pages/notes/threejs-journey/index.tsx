import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Subheader,
  Title,
} from "../../../components";
import { AnimationsSection } from "../../../interactives/notes/threejs-journey";

const ThreeJSJourneyPage = () => {
  return (
    <>
      <Head>
        <title>ThreeJS Journey Notes / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/notes/threejs-journey"
        />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:title"
          content="ThreeJS Journey Notes / Newt Interactive"
        />
        <meta
          property="twitter:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>ThreeJS Journey Notes</Title>
        <Lede>
          Random stuff from Bruno Simon's course,{" "}
          <a
            href="https://threejs-journey.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-slate-600 hover:text-slate-700 underline underline-offset-1 decoration-slate-700"
          >
            ThreeJS Journey
          </a>
        </Lede>
        <Subheader>06 &mdash; Animations</Subheader>
        <Paragraph>
          Animations in Three.js work like stop motion &mdash; each time an
          object moves, you render the changes. Take a look at a few ways you
          can animate a yellow box below:
        </Paragraph>
        <AnimationsSection />
      </ArticleContainer>
    </>
  );
};

export default ThreeJSJourneyPage;
