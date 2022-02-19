import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../../components";

const PaperExplainersPage = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Head>
        <title>Newt Interactive / Paper Explainers</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/papers"
        />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:title"
          content="Newt Interactive | Paper Explainers"
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
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Paper Explainers
        </h1>
        <h2 className="text-lg text-slate-600 mb-12">
          Breakdowns and beginner-friendly explanations of academic papers in
          STEM
        </h2>
        <div className="flex flex-wrap pb-12 sm:pb-16">
          <Link href="/papers/nuclear-fusion-ai">
            <a className="w-36 sm:w-48 mr-6 mb-6 sm:mr-12 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div>
                <Image
                  src="/images/nuclear-fusion-ai.jpg"
                  height={100}
                  width={178}
                  layout="responsive"
                  className="rounded-t-xl"
                  alt="3D model of DNA"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="font-medium text-slate-800">
                  Magnetic control of tokamak plasmas through deep reinforcement
                  learning
                </h3>
                <h4 className="text-sm sm:text-base text-slate-500 mt-4">
                  DeepMind
                </h4>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PaperExplainersPage;
