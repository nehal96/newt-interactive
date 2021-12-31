import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "../components";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <Head>
        <title>newt interactive</title>
      </Head>
      <Navbar />
      <main className="flex flex-col flex-auto h-full w-full max-w-5xl p-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Blocks</h1>
        <div className="flex">
          <Link href="/blocks/dna">
            <a className="w-40 mr-12 flex-wrap bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div className="md:flex">
                <Image
                  src="/images/DNA3d.jpg"
                  height={160}
                  width={160}
                  className="rounded-t-xl"
                  alt="3D model of DNA"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-slate-800">
                  3D Model of DNA
                </h3>
              </div>
            </a>
          </Link>
          <Link href="/blocks/robot-localization">
            <a className="w-40 bg-white rounded-xl shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div className="md:flex">
                <Image
                  src="/images/robot.jpg"
                  height={160}
                  width={160}
                  className="rounded-t-xl"
                  alt="cartoon robot"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-slate-800">
                  Simple Robot Localization
                </h3>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
