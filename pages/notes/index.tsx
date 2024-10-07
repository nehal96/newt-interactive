import Head from "next/head";
import Link from "next/link";
import { Navbar } from "../../components";

const NotesPage = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Head>
        <title>Notes / Newt Interactive</title>
        <meta
          name="description"
          content="Random stuff I'm learning from courses, tutorials, books, etc. on topics in science, technology, engineering, and math"
        />
        <meta
          name="keywords"
          content="notes, learning, courses, tutorials, books, science, technology, engineering, math"
        />
        <meta property="og:title" content="Notes / Newt Interactive" />
        <meta
          property="og:description"
          content="Random stuff I'm learning from courses, tutorials, books, etc. on topics in science, technology, engineering, and math"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta
          property="og:url"
          content="https://www.newtinteractive.com/notes"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@nehaludyavar" />
        <meta name="twitter:title" content="Notes / Newt Interactive" />
        <meta
          name="twitter:description"
          content="Random stuff I'm learning from courses, tutorials, books, etc. on topics in science, technology, engineering, and math"
        />
        <meta
          name="twitter:image"
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
          <Link href="/notes/threejs-journey" legacyBehavior>
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
