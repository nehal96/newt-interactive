import Head from "next/head";
import {
  TopicCard,
  TopicHeader,
  Navbar,
  Paragraph,
  SubscribeForm,
} from "../components";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
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
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-4 sm:p-8 md:p-12">
        <div className="flex flex-col mb-12 sm:mb-16 mt-12">
          <TopicHeader>Series</TopicHeader>
          <div className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mx-4 sm:-mx-8 md:-mx-12">
            <TopicCard
              href="/series/systems-biology"
              imageSrc="/images/genetic-circuit.png"
              title="Systems Biology"
              className="pl-4 sm:pl-8 md:pl-12"
            />
          </div>
        </div>
        <div className="flex flex-col mb-12 sm:mb-16">
          <TopicHeader>Blocks</TopicHeader>
          <div className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mx-4 sm:-mx-8 md:-mx-12">
            <TopicCard
              href="/blocks/robot-localization"
              imageSrc="/images/lost-looking-robot.png"
              title="Simple Robot Localization"
              className="pl-4 sm:pl-8 md:pl-12"
            />
            <TopicCard
              href="/blocks/dna"
              imageSrc="/images/glossy-dna-model.png"
              title="3D Model of DNA"
              darkText
            />
            <TopicCard
              href="/blocks/kalman-filters"
              imageSrc="/images/probability-distribution-artwork.png"
              title="1D Kalman Filters"
              darkText
            />
          </div>
        </div>
        <div className="flex flex-col mb-12 sm:mb-16">
          <TopicHeader>Notes</TopicHeader>
          <div className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mx-4 sm:-mx-8 md:-mx-12">
            <TopicCard
              href="/notes/threejs-journey"
              imageSrc="/images/3d-cube-and-sphere.png"
              title="Three.js Journey"
              className="pl-4 sm:pl-8 md:pl-12"
            />
          </div>
        </div>
        <div className="md:mt-4 border-b border-slate-200"></div>
        <Paragraph className="mt-12 md:mt-16">
          Welcome to Newt Interactive.
        </Paragraph>
        <Paragraph>
          Here, you will find interactive explainers and playgrounds on topics
          in science, technology, engineering, and math. I think learning should
          be as close to games as possible, and this space is where I'll begin
          to bring that thesis to reality.
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
            href={`mailto:nehal@newtinteractive.com?subject=${encodeURIComponent(
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
          If you like the work or the idea and would like to hear when I release
          new content, please subscribe below.
        </Paragraph>
        <SubscribeForm />
      </main>
    </div>
  );
}
