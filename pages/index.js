import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Newt Interactive</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Newt Interactive</h1>
        <Link href="/genetics">Genetics</Link>
        <Link href="/sdc/part-one">Robot Localization</Link>
      </main>
    </div>
  );
}
