import Head from "next/head";
import Link from "next/link";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
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
        <Paragraph>
          Explore our collection of interactive explainers on systems biology
          topics:
        </Paragraph>
        <OrderedList>
          <li>
            <Link href="/series/systems-biology/transcription-network-basics-1">
              <a className="text-blue-600 hover:underline">
                Transcription Network Basics: Part One
              </a>
            </Link>
          </li>
        </OrderedList>
      </ArticleContainer>
    </>
  );
};

export default SystemsBiologyExplainersPage;
