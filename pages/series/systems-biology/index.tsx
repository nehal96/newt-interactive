import Head from "next/head";
import Link from "next/link";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Title,
  OrderedList,
  H2,
} from "../../../components";

const SystemsBiologyExplainersPage = () => {
  return (
    <>
      <Head>
        <title>Systems Biology / Newt Interactive</title>
        <meta
          name="description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta
          name="keywords"
          content="systems biology, interactive explainers, transcription networks, gene expression, biological systems"
        />
        <meta
          property="og:title"
          content="Systems Biology / Newt Interactive"
        />
        <meta
          property="og:description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/Nnbfc6y/genetic-circuit.png"
        />
        <meta
          property="og:url"
          content="https://newtinteractive.com/series/systems-biology"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Systems Biology / Newt Interactive"
        />
        <meta
          name="twitter:description"
          content="Explore interactive explainers on systems biology concepts"
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/Nnbfc6y/genetic-circuit.png"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Systems Biology</Title>
        <Lede>
          Dive deep into complex biological systems through interactive
          explainers
        </Lede>
        <H2>Introduction to Transcription Networks</H2>
        <OrderedList>
          <li>
            <Link
              href="/series/systems-biology/transcription-network-basics-1"
              className="text-blue-600 hover:underline"
            >
              Transcription Network Basics
            </Link>
          </li>
          <li>
            <Link
              href="/series/systems-biology/transcription-network-basics-2"
              className="text-blue-600 hover:underline"
            >
              Activators and Repressors
            </Link>
          </li>
          <li>
            <Link
              href="/series/systems-biology/transcription-network-basics-3"
              className="text-blue-600 hover:underline"
            >
              Transcription Network Dynamics
            </Link>
          </li>
        </OrderedList>
      </ArticleContainer>
    </>
  );
};

export default SystemsBiologyExplainersPage;
