import Head from "next/head";
import Link from "next/link";
import { Navbar } from "../../components";

const NotesPage = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Head>
        <title>Newt Interactive / Notes</title>
        <meta
          name="description"
          content="Interactive, educational explainers and playgrounds on topics in science, technology, engineering, and math"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/blocks/robot-localization"
        />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta property="twitter:title" content="Newt Interactive" />
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
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Notes</h1>
        <h2 className="text-lg text-slate-600 mb-12">
          Random stuff I'm learning from courses, tutorials, books, etc.
        </h2>
        <div className="flex flex-wrap pb-12 sm:pb-16">
          <Link href="/notes/threejs-journey">
            <a className="w-28 sm:w-40 mr-6 mb-6 sm:mr-12 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div className="p-3 sm:p-5">
                <h3 className="sm:text-lg font-medium text-slate-800">
                  ThreeJS Journey
                </h3>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
