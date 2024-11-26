import Head from "next/head";
import {
  TopicCard,
  TopicHeader,
  Navbar,
  Paragraph,
  SubscribeForm,
  TopicCardContainer,
} from "../components";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen min-w-screen">
      <Head>
        <title>Newt Interactive</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta
          name="keywords"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta property="og:title" content="Newt Interactive" />
        <meta
          property="og:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta property="og:url" content="https://www.newtinteractive.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@nehaludyavar" />
        <meta name="twitter:title" content="Newt Interactive" />
        <meta
          name="twitter:description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
      </Head>
      <Navbar />
      <main className="flex flex-col flex-auto h-full w-full">
        <TopicCardContainer title="Series" className="mt-10 sm:mt-16">
          <TopicCard
            href="/series/systems-biology"
            imageSrc="/images/genetic-circuit.png"
            title="Systems Biology"
          />
        </TopicCardContainer>
        <TopicCardContainer title="Blocks">
          <TopicCard
            href="/blocks/circuit-evolution"
            imageSrc="/images/circuit-evolution-simulator.png"
            title="Genetic Circuit Evolution Simulator"
            withTitleBlur
          />
          <TopicCard
            href="/blocks/erdos-renyi-graph"
            imageSrc="/images/circle-in-a-circle-kandinsky.jpg"
            title="Erdős-Rényi Graph Generator"
            withTitleBlur
          />
          <TopicCard
            href="/blocks/robot-localization"
            imageSrc="/images/lost-looking-robot.png"
            title="Simple Robot Localization"
            withTitleBlur
          />
          <TopicCard
            href="/blocks/dna"
            imageSrc="/images/glossy-dna-model.png"
            title="3D Model of DNA"
            withTitleBlur
          />
          <TopicCard
            href="/blocks/kalman-filters"
            imageSrc="/images/probability-distribution-artwork.png"
            title="1D Kalman Filters"
            darkText
          />
        </TopicCardContainer>
        <TopicCardContainer title="Notes">
          <TopicCard
            href="/notes/threejs-journey"
            imageSrc="/images/3d-cube-and-sphere.png"
            title="Three.js Journey"
          />
        </TopicCardContainer>
        <div className="flex flex-col flex-auto max-w-5xl w-full px-5 self-center mb-12">
          <div className="md:mt-4 border-b border-slate-200" />
          <Paragraph className="mt-12 md:mt-16">
            Welcome to Newt Interactive.
          </Paragraph>
          <Paragraph>
            Here, you will find interactive explainers and playgrounds on topics
            in science, technology, engineering, and math. I think learning
            should be as close to games as possible, and this space is where
            I'll begin to bring that thesis to reality.
          </Paragraph>
          <Paragraph>
            If you have suggestions, found bugs, or just want to reach out, feel
            free to{" "}
            <a
              href="https://www.twitter.com/nehaludyavar"
              target="_blank"
              rel="noreferrer noopener"
              className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
            >
              DM me on Twitter
            </a>{" "}
            or{" "}
            <a
              href={`mailto:nehaludyavar@gmail.com?subject=${encodeURIComponent(
                "Hey! You're amazing!"
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
            >
              send me an email
            </a>
            .
          </Paragraph>
          <Paragraph className="mb-14 sm:mb-20">
            If you like the work or the idea and would like to hear when I
            release new content, please subscribe below.
          </Paragraph>
          <SubscribeForm />
        </div>
      </main>
    </div>
  );
}
