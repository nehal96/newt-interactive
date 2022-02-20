import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@reach/accordion";
import Head from "next/head";
import { FiChevronDown } from "react-icons/fi";
import {
  ArticleContainer,
  Lede,
  Navbar,
  PaperMetadata,
  Paragraph,
  Subheader,
  Title,
  YoutubeEmbed,
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
          className="mb-8"
        />
        <Subheader>Pre-requisite Questions</Subheader>
        <Accordion collapsible className="w-full self-center max-w-3xl">
          <AccordionItem>
            <AccordionButton className="w-full flex justify-between items-center border-b bprder-slate-100 py-1 md:py-2 hover:bg-slate-50">
              <h4 className="font-medium text-lg text-left text-slate-700 md:text-xl md:tracking-wide">
                What is nuclear fusion?
              </h4>
              <FiChevronDown />
            </AccordionButton>
            <AccordionPanel className="bg-slate-50 py-2">
              <Paragraph className="font-base mb-4">
                Nuclear fusion is a reaction that involves merging two atomic
                nuclei to make one larger one. This Kurzgesagt video, as usual,
                does a great job of explaining nuclear fusion:
              </Paragraph>
              <YoutubeEmbed embedId="mZsaaturR6E" />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton className="w-full flex justify-between items-center border-b bprder-slate-100 py-1 md:py-2 hover:bg-slate-50">
              <h4 className="font-medium text-lg text-left text-slate-700 md:text-xl md:tracking-wide">
                What is plasma?
              </h4>
              <FiChevronDown />
            </AccordionButton>
            <AccordionPanel className="bg-slate-50 py-2">
              <Paragraph className="font-base mb-0">
                Plasma is superheated matter &mdash; a soup of positively and
                negatively charged particles (ions and electrons). Just like you
                can heat up ice (a solid) to get water (a liquid), which you can
                then further heat up to get steam (a gas), you can futher heat
                up a gas to get plasma, the fourth state of matter.
              </Paragraph>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton className="w-full flex justify-between items-center border-b bprder-slate-100 py-1 md:py-2 hover:bg-slate-50">
              <h4 className="font-medium text-lg text-left text-slate-700 md:text-xl md:tracking-wide">
                What is a tokamak?
              </h4>
              <FiChevronDown />
            </AccordionButton>
            <AccordionPanel className="bg-slate-50 py-2">
              <Paragraph className="font-base mb-4">
                A tokamak is a machine that confines and controls plasma using
                magnetic fields. This video shows you what a tokamak looks like,
                and how it works (0:41 &ndash; 1:38):
              </Paragraph>
              <YoutubeEmbed embedId="xu7aY5xCGvc" start={41} />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton className="w-full flex justify-between items-center border-b bprder-slate-100 py-1 md:py-2 hover:bg-slate-50">
              <h4 className="font-medium text-lg text-left text-slate-700 md:text-xl md:tracking-wide">
                What do you mean by shaping and maintaining plasma?
              </h4>
              <FiChevronDown />
            </AccordionButton>
            <AccordionPanel className="bg-slate-50 py-2">
              <Paragraph className="font-base mb-4">
                If plasma touches the walls of a tokamak, it can cause a{" "}
                <i>disruption</i> and potentially damage the tokamak and stop
                the reaction. To prevent this, toroidal (horizontal) and
                poloidal (vertical) magnetic coils are used to generate magnetic
                fields to shape and maintain the plasma inside. This video
                illustrates it well (0:54 &ndash; 1:31):
              </Paragraph>
              <YoutubeEmbed embedId="I8hXBrEhxKU" start={54} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </ArticleContainer>
    </>
  );
};

export default NuclearFusionAIPage;
