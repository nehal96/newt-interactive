import Head from "next/head";
import { ArticleContainer, Lede, Navbar, Title } from "../../../components";
import { GaussianParameterUpdate } from "../../../interactives/kalman-filters";

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
        <GaussianParameterUpdate />
      </ArticleContainer>
    </>
  );
};

export default KalmanFilterPage;
