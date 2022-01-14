import Head from "next/head";
import { ArticleContainer, Lede, Navbar, Title } from "../../../components";

const KalmanFilterPage = () => {
  return (
    <>
      <Head>
        <title>Kalman Filters / Newt Interactive</title>
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Kalman Filters</Title>
        <Lede>Something something Kalman filters</Lede>
      </ArticleContainer>
    </>
  );
};

export default KalmanFilterPage;
