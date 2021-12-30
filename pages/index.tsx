import Head from "next/head";
import Link from "next/link";
import { Navbar } from "../components";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Head>
        <title>newt interactive</title>
      </Head>
      <Navbar />
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Posts</h1>
        <Link href="/genetics">
          <a className="font-medium text-xl mb-4 text-slate-600 hover:text-slate-800 hover:font-semibold">
            Discovering the Shape of Life
          </a>
        </Link>
        <Link href="/sdc/part-one">
          <a className="font-medium text-xl text-slate-600 hover:text-slate-800 hover:font-semibold">
            Robot Localization
          </a>
        </Link>
      </main>
    </div>
  );
}
