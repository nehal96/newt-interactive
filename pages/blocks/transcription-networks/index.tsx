import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  PostArticleSubscribe,
} from "../../../components";
import { TranscriptionNetworkTutorial } from "../../../interactives/transcription-networks";

const TranscriptionNetworkPage = () => {
  return (
    <>
      <Head>
        <title>Transcription Networks / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive explainer on transcription networks and their role in gene regulation"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/"
        />
        <meta property="twitter:title" content="Transcription Networks" />
        <meta
          property="twitter:description"
          content="Interactive explainer on transcription networks and their role in gene regulation"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/placeholder-image-url.png"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Networks</Title>
        <Lede>Understanding the complex interactions in gene regulation</Lede>
        <Paragraph>
          Transcription networks are complex systems that regulate gene
          expression in cells. They consist of transcription factors (TFs) that
          bind to DNA and control the transcription of genes.
        </Paragraph>
        <TranscriptionNetworkTutorial />
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkPage;
