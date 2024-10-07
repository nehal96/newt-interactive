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
          content="Interactive explainers on systems biology concepts"
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
            <Link href="/series/systems-biology/transcription-network-basics-1">
              <a className="text-blue-600 hover:underline">
                Transcription Network Basics: Part One
              </a>
            </Link>
          </li>
          <li>
            <Link href="/series/systems-biology/transcription-network-basics-2">
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
