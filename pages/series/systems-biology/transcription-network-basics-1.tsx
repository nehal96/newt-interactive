import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  PostArticleSubscribe,
  MathFormula,
  ImageSeries,
} from "../../../components";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";

const TranscriptionNetworkBasicsPartOne = () => {
  const images = [
    {
      src: "/images/gene-expression-diagram-3.svg",
      alt: "Diagram showing signal activation of transcription factor X and its role in gene Y expression",
      width: 870,
      height: 428,
      caption: (
        <div>
          Here the signal <MathFormula tex={"S_x"} /> transforms{" "}
          <MathFormula tex={"X"} /> into its active state,{" "}
          <MathFormula tex={"X^*"} />. <MathFormula tex={"X^*"} /> then binds to
          its binding site, which enables gene expression for protein{" "}
          <MathFormula tex={"Y"} />.
        </div>
      ),
    },
    {
      src: "/images/gene-expression-diagram-full.svg",
      alt: "Comprehensive diagram of gene expression process from signal to protein production",
      width: 870,
      height: 454,
      caption: <div className="mb-5">And here's the fully labeled diagram</div>,
    },
  ];

  return (
    <>
      <Head>
        <title>Transcription Network Basics: Part One / Newt Interactive</title>
        <meta
          name="description"
          content="Explore the fundamental concepts of transcription networks in systems biology. Learn about gene expression, transcription factors, and how cells respond to signals."
        />
        <meta
          name="keywords"
          content="transcription networks, gene expression, transcription factors, systems biology, cell signaling"
        />
        <meta
          property="og:title"
          content="Transcription Network Basics: Part One / Newt Interactive"
        />
        <meta
          property="og:description"
          content="Explore the fundamental concepts of transcription networks in systems biology. Learn about gene expression, transcription factors, and how cells respond to signals."
        />
        <meta property="og:image" content="https://ibb.co/n8t4xsL" />
        <meta
          property="og:url"
          content="https://newtinteractive.com/series/systems-biology/transcription-network-basics-1"
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Transcription Network Basics: Part One | Introduction to Gene Expression"
        />
        <meta
          name="twitter:description"
          content="Learn about the basics of transcription networks, gene expression, and how cells respond to signals in systems biology."
        />
        <meta name="twitter:image" content="https://ibb.co/n8t4xsL" />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Network Basics: Part One</Title>
        <Lede>
          Understanding the fundamental concepts of transcription networks
        </Lede>
        <Paragraph>
          Let's say that in one of your cells, the membrane that houses the cell
          has been damaged. In order to fix it, your cell needs to produce
          repair proteins. How might it do so?
        </Paragraph>
        <Paragraph>
          To answer this, let's first set up a simple framework, and then bit by
          bit, fill in the details. First, in order for your cell to begin
          creating repair proteins, it must know that your cell is damaged
          &mdash; it needs some kind of signal. Then, once it receives that
          signal, it can begin producing the repair proteins to fix the
          membrane. Easy enough.
        </Paragraph>
        <Paragraph>
          But there's another step: after your cell has completed its repairs,
          it needs to know when to stop producing repair proteins. Protein
          production uses up valuable resources, so your cell probably shouldn't
          waste it creating repair proteins it doesn't need. Once the repairs
          are done, the cell can stop transmitting the repair signal, and as a
          result stop production.
        </Paragraph>
        <Paragraph>
          So, we have a very simple framework so far: a cell receives a signal,
          begins producing corresponding proteins; stops receiving the signal,
          stops producing those proteins. Essentially, like a traffic light for
          protein production.
        </Paragraph>
        <Paragraph>
          Proteins are encoded in genes, so when we talk about protein
          production, we're really talking about gene expression. In our simple
          model, the presence of a signal promotes gene expression, and its
          absence stops it. We can show this in a simple diagram:
        </Paragraph>
        <div className="flex justify-center mt-4 mb-12">
          <div className="max-w-[400px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-1.svg"
              alt="Simple diagram illustrating signal-induced gene expression"
              layout="responsive"
              width={755}
              height={190}
            />
          </div>
        </div>
        <Paragraph>
          Let's take a quick look into how gene expression works. A gene is a
          stretch of DNA that encodes a protein, normally represented in text by
          a series of bases: ACTAGCC, for example. An enzyme, RNA polymerase,
          attaches itself to a binding site just preceding the gene, and moves
          along the gene and uses the information to synthesize messenger RNA,
          or mRNA for short. This process is called{" "}
          <strong>transcription</strong>. The mRNA is transported to the
          ribosome, the cell's molecular factory, where it is used to synthesize
          &mdash; amino acid by amino acid &mdash; the new protein, in a process
          known as <strong>translation</strong>. The newly minted protein is
          then transported, either inside or outside the cell, where it can
          begin its job.
        </Paragraph>
        <Paragraph>
          We can update our diagram to include some of these details:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12">
          <div className="max-w-[500px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-2.svg"
              alt="Detailed diagram of gene expression process from DNA to protein production"
              layout="responsive"
              width={745}
              height={323}
            />
          </div>
          <div className="max-w-[550px] w-full mx-auto text-center my-2 text-xs text-gray-500">
            The horizontal line represents DNA. Gene Y labels the portion of DNA
            that encodes the gene for protein Y.
          </div>
        </div>
        <Paragraph>
          It still illustrates the same process as the very simplified one
          above, but with the specific machinery that enable gene expression.
          There's a small part of the puzzle still missing: how the signal{" "}
          <strong>S</strong> plays a role here. We know, from the simple
          framework we set up above, that it should play the role of a switch:
          turn on gene expression when the signal is present; turn off gene
          expression when it's not.
        </Paragraph>
        <Paragraph>
          The missing piece, the macromolecule that enables this switch-like
          functionality, is a special protein known as a{" "}
          <strong>transcription factor</strong>. Transcription factors can shift
          rapidly between an active and inactive state based on the presence (or
          lack thereof) of a signal. When active, they bind to DNA and regulate
          the rate at which genes are read, like a molecular valve. In effect,
          they play a very important role acting as a bridge between a signal
          and a change in protein production.
        </Paragraph>
        <Paragraph>
          Let’s update our diagram again. The first shows just the changes, the
          second is the fully labeled diagram:
        </Paragraph>
        <ImageSeries images={images} />
        <Paragraph>
          This is a simple model of how a cell responds to a signal. Our
          example, membrane damage, is just one of the many signals cells can
          send to communicate changes in their environment. Higher temperature,
          an influx of nutrients or toxins, damage to DNA, and even signaling
          molecules from other cells (hormones are one example of this) all have
          their own signals that interact with transcription factors.
        </Paragraph>
        <Paragraph>
          Transcription factors are also proteins, so they themselves are
          encoded in genes, which can be regulated by other transcription
          factors, which in turn can be regulated by other transcription
          factors, and so on. This creates a pretty complex set of interactions,
          and can be modeled as a network &mdash;{" "}
          <strong>transcription networks</strong>. As we will uncover in this
          series, combining transcription factors result in some very
          interesting properties and incredible solutions life has found for
          problems it faces. We’ll explore how cells can respond instantly, or
          with a delay when necessary; how they can perform logical operations,
          their own version of OR and AND gates from computers; how different
          network structures keep showing up in different forms of life and how
          they give organisms an evolutionary advantage; how cells can create
          memory, and much, much more.
        </Paragraph>
        <div className="flex justify-center mt-4 mb-12">
          <Image
            src="/images/transcription-network-systems-biology.png"
            alt="Complex transcription network diagram of E. coli showing interconnected genes and regulatory elements"
            width={600}
            height={600}
          />
        </div>
        <div className="max-w-[550px] w-full mx-auto text-center mb-9 text-xs text-gray-500">
          Taken from An Introduction to Systems Biology (Uri Alon, 2006)
        </div>
        <Paragraph>
          For now, I’ll leave you with this picture of a transcription network
          that includes about 20% of the genes in <i>E. coli</i>. It’s pretty
          complex, but we’ll break them into smaller networks and find
          understandable patterns in this upcoming series. In Part Two, we’ll
          learn about the two types of transcription factors, mathematically
          model increases or decreases in protein production, and take a closer
          look at what those arrows in the network represent.
        </Paragraph>
        <div className="flex justify-end max-w-3xl w-full mx-auto mt-10 mb-4">
          <Link
            href="/series/systems-biology/transcription-network-basics-2"
            legacyBehavior
          >
            <a className="flex flex-col text-lg font-medium border-b border-b-transparent hover:border-b-slate-300">
              <span className="text-slate-500 text-sm mb-2">Next</span>
              <div className="inline-flex items-center text-slate-800">
                Transcription Network Basics: Part Two
                <FiChevronRight className="ml-2" />
              </div>
            </a>
          </Link>
        </div>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkBasicsPartOne;
