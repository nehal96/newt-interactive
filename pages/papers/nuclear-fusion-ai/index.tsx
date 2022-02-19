import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  PaperMetadata,
  Title,
} from "../../../components";

const NuclearFusionAIPage = () => {
  return (
    <>
      <Head>
        <title>Nuclear Fusion + AI Paper / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/papers/nuclear-fusion-ai"
        />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:title"
          content="Nuclear Fusion + AI Paper | Newt Interactive"
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
        <Title>Nuclear Fusion + AI</Title>
        <Lede>
          Magnetic control of tokamak plasmas through deep reinforcement
          learning by DeepMind
        </Lede>
        <PaperMetadata
          title="Magnetic control of tokamak plasmas through deep reinforcement learning"
          authors={["DeepMind", "Swiss Plasma Center"]}
          datePublished="16 Feb 2022"
          paperLink="https://www.nature.com/articles/s41586-021-04301-9"
          blogLink="https://www.deepmind.com/blog/article/Accelerating-fusion-science-through-learned-plasma-control"
        />
      </ArticleContainer>
    </>
  );
};

export default NuclearFusionAIPage;
