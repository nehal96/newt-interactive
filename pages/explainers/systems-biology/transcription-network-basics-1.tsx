import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  PostArticleSubscribe,
} from "../../../components";
import Image from "next/image";

const TranscriptionNetworkBasicsPartOne = () => {
  return (
    <>
      <Head>
        <title>Transcription Network Basics: Part One / Newt Interactive</title>
        <meta
          name="description"
          content="Interactive explainer on the basics of transcription networks in systems biology"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Transcription Network Basics: Part One</Title>
        <Lede>
          Understanding the fundamental concepts of transcription networks in
          systems biology
        </Lede>
        <Paragraph>
          Let's say that in one of your cells, the membrane has been damaged. In
          order to fix the membrane, your cell needs to produce repair proteins.
          How might it do so? To answer this, let's set up a simple framework,
          and then bit by bit, fill in the details.
        </Paragraph>
        <Paragraph>
          First, in order for your cell to begin creating repair proteins, it
          must know that your cell is damaged &mdash; it needs some kind of
          signal. Once it receives that signal, it can begin producing the
          repair proteins to fix the membrane. Easy enough. But there's another
          step: after your cell has done its repairs, it needs to know when to
          stop producing repair proteins. Protein production uses up valuable
          resources, so your cell probably shouldn't waste it creating repair
          proteins it doesn't need. One of the simplest ways this is achieved is
          if the cell stops transmitting the repair signal, and as a result
          production stops.
        </Paragraph>
        <Paragraph>
          So, we have a very simple framework so far: a cell receives a signal,
          begins producing corresponding proteins; stops receiving the signal,
          stops producing the proteins. Like a traffic light for protein
          production.
        </Paragraph>
        <Paragraph>
          Proteins are encoded in genes, so when we talk about protein
          production, we're really talking about gene expression. The presence
          of the signal promotes gene expression, and its absence stops it. We
          can show this in a simple diagram:
        </Paragraph>
        <div className="flex justify-center mt-4 mb-12">
          <div className="max-w-[400px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-1.svg"
              alt="Gene Expression Diagram"
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
          along the gene and uses the information to synthesize mRNA. This
          process is called <strong>transcription</strong>. The mRNA is
          transported to the ribosome, the cell's molecular factory, where it is
          used to synthesize, amino acid by amino acid, the new protein. This
          process is called <strong>translation</strong>. The newly minted
          protein is then transported, either inside or outside the cell, where
          it can begin its job.
        </Paragraph>
        <Paragraph>
          So, an updated diagram would look something like this:
        </Paragraph>
        <div className="flex justify-center mt-4 mb-12">
          <div className="max-w-[500px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-2.svg"
              alt="Updated Gene Expression Diagram"
              layout="responsive"
              width={745}
              height={323}
            />
          </div>
        </div>
        <Paragraph>
          There's a small part of the puzzle still missing: how the signal{" "}
          <strong>S</strong> plays a role here. We began with the example of a
          signal that represents membrane damage, but cells have many different
          kinds of of signals that indicate a change in their environment, like
          higher temperature, an influx of nutrients or toxins, damage to DNA
          (or membranes), and even signaling molecules from other cells
          (hormones are one example of this). To bridge this signal to a change
          in protein production, cells use a special protein called a
          transcription factor that acts as a representative of the cell's
          environmental state. Transcription factors can shift rapidly between
          an active and inactive state based on the presence (or lack thereof)
          of a signal. When active, they bind to DNA and regulate the rate at
          which genes are read, like a molecular valve. As the name suggests,
          they are a factor in transcription.
        </Paragraph>
        <Paragraph>
          Let’s update our diagram again (including one more additional piece of
          information: the region that precedes the gene, where the binding
          sites for RNAp and transcription factors lie, is called the{" "}
          <strong>promoter</strong>):
        </Paragraph>
        <div className="flex justify-center mt-4 mb-12">
          <div className="max-w-[550px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-3.svg"
              alt="Gene Expression Diagram 3"
              layout="responsive"
              width={870}
              height={454}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4 mb-12">
          <div className="max-w-[550px] w-full mx-auto">
            <Image
              src="/images/gene-expression-diagram-full.svg"
              alt="Full Gene Expression Diagram"
              layout="responsive"
              width={870}
              height={454}
            />
          </div>
        </div>
        <Paragraph>
          So now: a signal activates a transcription factor, which binds to its
          binding site, which enables RNA polymerase to bind to its binding site
          and begin transcribing DNA into mRNA, which is translated into a
          protein. This is just one simplified example of a sequence of steps,
          but it ‘s important to understand the biology that we’ll subsequently
          abstract away.
        </Paragraph>
        <Paragraph>
          Transcription factors are also proteins, so they themselves are
          encoded in genes, which can be regulated by other transcription
          factors, which in turn can be regulated by other transcription
          factors, and so on. This complex set of interactions can be modeled as
          a network &mdash; transcription networks &mdash; and as we will
          uncover in this series, result in some very interesting properties.
          The analysis will uncover the incredible solutions life has found for
          problems it faces: how it self-regulates, how it responds to different
          situations, how it performs logical operations (like OR and AND gates
          in computers), and how these phenomena give organisms an advantage in
          surviving and replicating.
        </Paragraph>
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default TranscriptionNetworkBasicsPartOne;
