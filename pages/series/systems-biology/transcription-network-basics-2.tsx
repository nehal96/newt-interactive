import Head from "next/head";
import Image from "next/image";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Title,
  Paragraph,
  PostArticleSubscribe,
  MathFormula,
  UnorderedList,
  ImageSeries,
  Subheader,
} from "../../../components";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import {
  ActivatorTutorial,
  RepressorTutorial,
} from "../../../interactives/systems-biology";

const TranscriptionNetworkBasicsPartTwo = () => {
  const repressorImages = [
    {
      src: "/images/repressor-on-diagram.svg",
      alt: "Repressor On Diagram",
      width: 748,
      height: 395,
      caption: "When the repressor is not bound, gene expression is ON.",
    },
    {
      src: "/images/repressor-off-diagram.svg",
      alt: "Repressor Off Diagram",
      width: 749,
      height: 403,
      caption: "When the repressor is bound, gene expression is OFF.",
    },
  ];

  return (
    <>
      <Head>
        <title>Transcription Network Basics: Part Two / Newt Interactive</title>
        <meta
          name="description"
          content="Exploring types of transcription factors and mathematical modeling of protein production in transcription networks"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Network Basics: Part Two</Title>
        <Lede>Lede</Lede>
        <Paragraph>
          In Part One, we described what transcription factors are and
          introduced the topic of transcription networks. In short,
          transcription factors are special proteins that increase or decrease
          the rate of gene expression, and transcription networks illustrate and
          explain the complex interactions between transcription factors and
          genes. In this segment, we'll look a little deeper at how
          transcription factors affect gene expression; namely, how they can
          increase or decrease the transcription rate of a gene. We'll also
          introduce simple network diagrams to illustrate transcription
          factor-gene relationships, and finally, look at the mathematical
          relationships between transcription factors and their corresponding
          proteins.
        </Paragraph>
        <Paragraph>
          In the previous section, we built our way up to the following diagram:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12">
          <div className="max-w-[550px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-full.svg"
              alt="Full Gene Expression Diagram"
              layout="responsive"
              width={745}
              height={323}
            />
          </div>
          {/* <div className="max-w-[550px] w-full mx-auto text-center my-2 text-xs text-gray-500">
            The horizontal line represents DNA. Gene Y labels the portion of DNA
            that encodes the gene for protein Y.
          </div> */}
        </div>
        <Paragraph>
          A signal <MathFormula tex="S_x" /> transforms the transcription factor{" "}
          <MathFormula tex="X" /> into its active state{" "}
          <MathFormula tex="X^*" />, which binds to its binding site enabling
          RNA polymerase to begin transcribing DNA into mRNA, which is
          translated into the protein <MathFormula tex="Y" />.
        </Paragraph>
        <Paragraph>
          This diagram describes one type of transcription factor, the{" "}
          <strong>activator</strong>, which, when bound to DNA, <i>increases</i>{" "}
          the transcription rate of a gene. There's another type, the{" "}
          <strong>repressor</strong>, that decreases the transcription rate. For
          repressors, gene expression is on by default; the binding of a
          repressor turns it off. These simple diagram illustrate what on and
          off look like:
        </Paragraph>
        <ImageSeries images={repressorImages} />
        <Paragraph>
          (Just to note: for an activator, when the transcription factor is not
          bound, gene expression is off. It is the binding in its active state
          that turns on gene expression.)
        </Paragraph>
        <Paragraph>
          We can represent this activating or repressing relationship in network
          diagrams as well. Activators are denoted by a regular arrow, and
          repressors are denoted by a blunt-headed arrow:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12">
          <div className="max-w-[500px] w-full mx-auto">
            <Image
              src="/images/activator-repressor-notation.svg"
              alt="Activator and Repressor Notation"
              layout="responsive"
              width={593}
              height={184}
            />
          </div>
        </div>
        <Subheader>Mathematical Models</Subheader>
        <Paragraph>
          So far, we’ve talked about transcription factors like they’re a
          switch; they turn genes on or off. In reality, they’re more like a
          valve; they increase or decrease the rate of production of a protein.
          This may include turning it on or off, but ramping up or ramping down
          production paints a more accurate picture. The arrows, in effect,
          don’t only signify the positive or negative relationship, but the
          strength of that relationship as well.
        </Paragraph>
        <Paragraph>
          Before we dive into some math, it’s important to understand its
          context: the inner workings of a cell. Cells are a crowded place,
          stuffed with molecules large and small: proteins, nucleic acids, amino
          acids, sugars, ATP, and other small molecules, all surrounded by
          water. Moving inside a cell involves a lot of bumping into one another
          constantly, like hastily making your way across a crowded nightclub
          floor.{" "}
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12">
          <div className="max-w-[500px] w-full mx-auto">
            <Image
              src="/images/e-coli-goodsell.png"
              alt="E. coli Cell"
              layout="responsive"
              width={500}
              height={500}
            />
          </div>
          <div className="max-w-[600px] w-full mx-auto text-center my-2 text-xs text-gray-500">
            This painting shows a cross-section through an{" "}
            <i>Escherichia coli</i> cell. Illustration by David S. Goodsell,
            RCSB Protein Data Bank. doi: 10.2210/rcsb_pdb/goodsell-gallery-028
          </div>
        </div>
        <Paragraph>
          It is this bumping, however, that enables the molecular interactions
          that sustain life. Molecular interactions occur at specific
          orientations: the atoms or molecules connect best at some specific
          region, like two adjacent puzzle pieces. The crowded environment means
          two elements will spend more time next to each other, shuffling and
          bumping, which increases the <i>likelihood</i> of reactions.
        </Paragraph>
        <Paragraph>
          “Crowded” and “likelihood” hint towards two features that we can use
          mathematically: concentration and probability. The higher the
          concentration of a molecule in a cell, the more there is of it given
          some volume, and so the higher the chance of the right kind of
          molecular interaction.
        </Paragraph>
        <Paragraph>
          We can use this when we think of interactions with transcription
          factors. The number of molecules of protein <MathFormula tex="Y" />{" "}
          produced per unit of time is dependant on the concentration of{" "}
          <MathFormula tex="X" /> in its active form, <MathFormula tex="X^*" />.
        </Paragraph>
        <Paragraph>
          Mathematically, we can write this as as an{" "}
          <strong>input function</strong>:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="\text{rate of production of Y} = f(X^*)" />
        </div>
        <Paragraph>
          It is an increasing function when <MathFormula tex="X" /> is an
          activator and a decreasing function when <MathFormula tex="X" /> is a
          repressor.
        </Paragraph>
        <Paragraph>
          One function that realistically represents protein production is the
          Hill function. Let’s look at activators first. The Hill function for
          an activator is defined as:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="f(X^*) = \dfrac{X^{*n}}{K^n + X^{*n}}" />
        </div>
        <Paragraph>where:</Paragraph>
        <UnorderedList>
          <li>
            <MathFormula tex="K" /> is the{" "}
            <strong>activation coefficient</strong>; it defines the
            concentration of <MathFormula tex="X^*" />, the active form of{" "}
            <MathFormula tex="X" />, needed to significantly activate
            expression.
          </li>
          <li>
            <MathFormula tex="\beta" /> is the{" "}
            <strong>maximal promoter activity</strong>: the maximum rate of
            production of <MathFormula tex="Y" />, achieved at very high
            concentrations of <MathFormula tex="X^*" /> (higher probability of
            binding)
          </li>
          <li>
            <MathFormula tex="n" /> is the <strong>Hill coefficient</strong>,
            and determines the steepness of the curve (typically between 1 and
            4)
          </li>
        </UnorderedList>
        <Paragraph>
          Let's take a look at what this looks like graphically and what that
          means:
        </Paragraph>
        <ActivatorTutorial />
        <Paragraph>
          For a repressor, the Hill function decreases as we increase the
          concentration of X*, as described by the equation:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="f(X^*) = \dfrac{K^{n}}{K^n + X^{*n}}" />
        </div>
        <RepressorTutorial />
        <Paragraph>
          Evolution can tinker with these numbers through mutations in DNA. For
          example, a mutation in the transcription factor binding site can
          strengthen the bonds between the transcription factor and the site,
          thus increasing the likelihood of bonding and lowering the values of K
          (less concentration needed for significant gene expression). Shifting
          around the promoter region can also change the value of K. Mutations
          in the RNA polymerase binding site can change the value of B.
        </Paragraph>
        <Paragraph>
          Scientists can also use the same phenomena to tinker and engineer
          biological changes. Genes are modular; you can take a gene from one
          organism and express it in another. One gene that is very often used
          in biological experiments is the gene for the green fluorescent
          protein (GFP), taken from a jellyfish. When introduced into bacteria,
          it expresses the gene and turns green. You can also regulate its
          expression by adding a promoter region. For example, when the promoter
          for a sugar-inducible transcription factor is added in front of the
          GFP gene, the bacteria only turns green when the sugar is present.
        </Paragraph>
        <div className="flex justify-start max-w-3xl w-full mx-auto mt-10 mb-4">
          <Link
            href="/series/systems-biology/transcription-network-basics-1"
            legacyBehavior
          >
            <a className="flex flex-col text-lg font-medium border-b border-b-transparent hover:border-b-slate-300">
              <span className="text-slate-500 text-sm mb-2 ml-7">Previous</span>
              <div className="inline-flex items-center text-slate-800">
                <FiChevronLeft className="mr-2" />
                Transcription Network Basics: Part One
              </div>
            </a>
          </Link>
        </div>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkBasicsPartTwo;