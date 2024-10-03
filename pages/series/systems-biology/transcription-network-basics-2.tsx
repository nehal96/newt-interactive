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
  OrderedList,
  InteractiveTutorialContainer,
  TextContainer,
  InteractiveContainer,
  ImageSeries,
  Subheader,
} from "../../../components";
import { useState } from "react";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import {
  ActivatorTutorial,
  RepressorGraph,
} from "../../../interactives/systems-biology";

export const getRepressorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const repressorHillFunction = (x) => {
    return (beta * K ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = repressorHillFunction(x);
    data.push({ x, y });
  }

  return data;
};

const TranscriptionNetworkBasicsPartTwo = () => {
  const [repressorBeta, setRepressorBeta] = useState(20);
  const [repressorK, setRepressorK] = useState(5);
  const [repressorN, setRepressorN] = useState(1);
  const [currentSlideNumber, setCurrentSlideNumber] = useState(1);

  const repressorHillFunctionData = getRepressorHillFunctionData(
    repressorBeta,
    repressorK,
    repressorN,
    0,
    20
  );

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

  const slides = {
    4: {
      text: (
        <>
          <p>
            You might notice, either from the curve or the equation, that half
            the maximal promoter activity,{" "}
            <MathFormula tex="\dfrac{\beta}{2}" />, occurs when{" "}
            <MathFormula tex="X^* = K" />. Click on the toggle to see this
            illustrated on the chart.
          </p>
        </>
      ),
    },
  };

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
          In Part One, we provided the context for and introduced the topic of
          transcription networks. In short, they describe the interactions
          between transcription factors and genes. In this segment, we'll look a
          little deeper at how transcription factors affect gene expression;
          namely, how they can increase or decrease the transcription rate of a
          gene. We'll also introduce simple network diagrams to illustrate
          transcription factor-gene relationships, and finally, look at the
          mathematical relationships between transcription factors and their
          corresponding proteins.
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
          <MathFormula tex="X^*" />, which binds to its binding site and enables
          RNA polymerase to bind to its binding site and begin transcribing DNA
          into mRNA, which is translated into the protein{" "}
          <MathFormula tex="Y" />.
        </Paragraph>
        <Paragraph>
          This diagram describes one type of transcription factors: the{" "}
          <strong>activator</strong>, which, when bound to DNA, increases the
          transcription rate of a gene. There's another type, the{" "}
          <strong>repressor</strong>, that decreases the transcription rate. A
          simple diagram representing a repressor would look something like
          this:
        </Paragraph>
        <ImageSeries images={repressorImages} />
        <Paragraph>
          (Note that, for an activator, when the TF is not bound, as gene
          expression is OFF).
        </Paragraph>
        <Paragraph>
          We can represent this activating or repressing relationship in network
          diagrams as well. Activators are denoted by a regular arrow: X → Y,
          and repressors are denoted by a blunt-headed arrow,{" "}
          <MathFormula tex="X \Rightarrow Y" />. This notation will be used
          throughout to denote whether transcription factors are activators or
          repressors.
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
          valve; they increase (for activators) or decrease (for repressors) the
          rate of production of a protein. This may include turning it on or
          off, but ramping up or ramping down production paints a more accurate
          picture. The arrows, in effect, don’t only signify the positive or
          negative relationship, but the strength of that relationship as well.
        </Paragraph>
        <Paragraph>
          We can describe the strength of the effect of a TF on a target gene
          with an input function. X → Y represents that the number of molecules
          of protein Y produced per unit of time is a function of the
          concentration of X in its active form, X*.{" "}
        </Paragraph>
        <Paragraph>Mathematically, we can write this as:</Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="\text{rate of production of Y} = f(X^*)" />
        </div>
        <Paragraph>
          It is an increasing function when X is an activator and a decreasing
          function when X is a repressor. One function that realistically
          represents protein production is the Hill function, which is defined
          as:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="f(X^*) = \dfrac{X^{*n}}{K^n + X^{*n}}" />
        </div>
        <Paragraph>Let’s take a look at the parameters:</Paragraph>
        <OrderedList>
          <li>
            K is the activation coefficient; it defines the concentration of X*,
            the active form of X, needed to significantly activate expression.
          </li>
          <li>
            β is the maximal promoter activity: the maximum rate of production
            of Y, achieved at very high concentrations of X* (higher probability
            of binding)
          </li>
          <li>
            n is the Hill coefficient, and determines the steepness of the curve
            (typically n is between 1 and 4)
          </li>
        </OrderedList>
        <ActivatorTutorial />
        <Paragraph>
          For a repressor, the Hill function decreases as we increase the
          concentration of X*, as described by the equation:
        </Paragraph>
        <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
          <MathFormula tex="f(X^*) = \dfrac{K^{n}}{K^n + X^{*n}}" />
        </div>
        <Paragraph>
          Since it represses gene expression, we get maximum promoter activity
          when X* = 0. Just like with the activator, half maximal expression if
          found at X* = K.
        </Paragraph>
        <InteractiveTutorialContainer>
          <TextContainer>hello</TextContainer>
          <InteractiveContainer className="lg:w-3/5">
            <RepressorGraph
              repressorBeta={repressorBeta}
              repressorK={repressorK}
              repressorHillFunctionData={repressorHillFunctionData}
            />
          </InteractiveContainer>
        </InteractiveTutorialContainer>
        <div className="flex flex-col justify-center max-w-3xl w-full mt-4 mb-12 mx-auto">
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {repressorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={repressorBeta}
                onChange={(e) => setRepressorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {repressorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="1"
                max="10"
                step="0.1"
                value={repressorK}
                onChange={(e) => setRepressorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {repressorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="1"
                max="4"
                step="0.1"
                value={repressorN}
                onChange={(e) => setRepressorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </div>
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