import Head from "next/head";
import Link from "next/link";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Title,
  OrderedList,
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
        <OrderedList>
          <li>
            <Link
              href="/series/systems-biology/transcription-network-basics-1"
              legacyBehavior
            >
              <a className="text-blue-600 hover:underline">
                Transcription Network Basics: Part One
              </a>
            </Link>
          </li>
          <li>
            <Link
              href="/series/systems-biology/transcription-network-basics-2"
              legacyBehavior
            >
              <a className="text-blue-600 hover:underline">
                Transcription Network Basics: Part Two
              </a>
            </Link>
          </li>
        </OrderedList>
      </ArticleContainer>
    </>
  );
};

export default SystemsBiologyExplainersPage;
