import Head from "next/head";
import Image from "next/image";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  PostArticleSubscribe,
  Subheader,
  MathFormula,
} from "../../../components";

const SystemsBiologyPage = () => {
  return (
    <>
      <Head>
        <title>Systems Biology Notes / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive explainers and notes on systems biology concepts"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/notes/systems-biology"
        />
        <meta property="twitter:title" content="Systems Biology Notes" />
        <meta
          property="twitter:description"
          content="Interactive explainers and notes on systems biology concepts"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/placeholder-image-url.png"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Systems Biology Notes</Title>
        <Lede>
          Exploring complex biological systems through interactive models
        </Lede>
        {/* <div className="max-w-3xl self-center"> */}
        <Paragraph>
          Systems biology is an interdisciplinary field that focuses on complex
          interactions within biological systems, using a holistic approach to
          biological research. These notes cover various concepts and models in
          systems biology.
        </Paragraph>
        {/* </div> */}

        <Subheader className="mt-12">
          1 &mdash; Transcription Networks
        </Subheader>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mt-6 xl:ml-32 max-w-4xl self-center">
          <div className="lg:col-span-3">
            <Paragraph className="text-justify">
              In transcription networks, genes can be regulated by activators
              and repressors. These regulatory proteins can change their shape
              in response to signals, affecting the transcription rate of target
              genes.
            </Paragraph>
            <Paragraph className="mt-4">
              When an activator is unbound, the gene is typically OFF. A signal{" "}
              <MathFormula tex="S_{x}" /> can cause the activator X to change
              its shape to its active state. Once activated and bound, it
              increases the transcription rate of gene Y.
            </Paragraph>
          </div>
          <div className="lg:col-span-2">
            <div className="relative aspect-[1.23] h-[300px] w-full">
              <Image
                src="/images/activator-binding-diagram.png"
                alt="Activator binding"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mt-12 xl:ml-32 max-w-4xl self-center">
          <div className="lg:col-span-3">
            <Paragraph>
              Conversely, for repressors, the gene is typically ON when the
              repressor is unbound. When a signal <MathFormula tex="S_{x}" />{" "}
              causes the repressor X to change to its active state, it binds to
              the DNA and decreases the transcription rate of gene Y.
            </Paragraph>
            <Paragraph className="mt-4">
              This interplay between activators and repressors allows for
              complex regulation of gene expression, enabling cells to respond
              to various environmental signals and maintain homeostasis.
            </Paragraph>
          </div>
          <div className="lg:col-span-2">
            <div className="relative aspect-auto h-[362px] w-full">
              <Image
                src="/images/repressor-binding-diagram.png"
                alt="Repressor binding"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default SystemsBiologyPage;
