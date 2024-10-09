import Head from "next/head";
import Link from "next/link";
import Image from "next/legacy/image";
import { Navbar, Paragraph, SubscribeForm } from "../components";

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
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Series</h1>
        <div className="flex flex-wrap pb-12 sm:pb-16">
          <Link href="/series/systems-biology" legacyBehavior>
            <a className="w-28 sm:w-40 mr-6 mb-6 sm:mr-12 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div>
                <Image
                  src="/images/genetic-circuit.png"
                  height={160}
                  width={160}
                  layout="responsive"
                  className="rounded-t-xl"
                  alt="cartoon robot"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  Systems Biology
                </h3>
              </div>
            </a>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Blocks</h1>
        <div className="flex flex-wrap pb-12 sm:pb-16">
          <Link href="/blocks/robot-localization" legacyBehavior>
            <a className="w-28 sm:w-40 mr-6 mb-6 sm:mr-12 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div>
                <Image
                  src="/images/robot.jpg"
                  height={160}
                  width={160}
                  layout="responsive"
                  className="rounded-t-xl"
                  alt="cartoon robot"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  Simple Robot Localization
                </h3>
              </div>
            </a>
          </Link>
          <Link href="/blocks/dna" legacyBehavior>
            <a className="w-28 sm:w-40 mr-6 mb-6 sm:mr-12 flex-wrap bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div>
                <Image
                  src="/images/DNA3d.jpg"
                  height={160}
                  width={160}
                  layout="responsive"
                  className="rounded-t-xl"
                  alt="3D model of DNA"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  3D Model of DNA
                </h3>
              </div>
            </a>
          </Link>
          <Link href="/blocks/kalman-filters" legacyBehavior>
            <a className="w-28 sm:w-40 mb-6 flex-wrap bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <Image
                src="/images/kalman-1d.jpg"
                height={160}
                width={160}
                layout="responsive"
                className="rounded-t-xl"
                alt="1D Kalman filter"
              />
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  1D Kalman Filters
                </h3>
              </div>
            </a>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Notes</h1>
        <div className="flex flex-wrap pb-12 sm:pb-16 border-b border-b-slate-200">
          <Link href="/notes/threejs-journey" legacyBehavior>
            <a className="w-28 sm:w-40 mr-6 mb-6 sm:mr-12 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div>
                <Image
                  src="/images/threejs-journey-card-pic.png"
                  height={160}
                  width={160}
                  layout="responsive"
                  className="rounded-t-xl"
                  alt="cartoon robot"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  ThreeJS Journey
                </h3>
              </div>
            </a>
          </Link>
        </div>
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
