import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Genetics</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Newt Interactive</h1>
        <Link href="/genetics">Genetics</Link>
      </main>
    </div>
  );
}
