import Head from "next/head";
import Link from "next/link";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  PostArticleSubscribe,
  Title,
} from "../../../components";
import { GaussianParameterUpdateTutorial } from "../../../interactives/kalman-filters";

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
        <Paragraph>
          In the{" "}
          <Link href="/blocks/robot-localization">
            <a className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700">
              Simple Robot Localization block
            </a>
          </Link>
          , we saw how we combined uncertainty in a robot's position and robot's
          movement to eventually gain more confidence about the location of the
          robot.
        </Paragraph>
        <Paragraph>
          But this was for <b>discrete</b> movement. In the real world, movement
          is <b>continuous</b>. Cars and ice skaters don't instantaneously
          teleport from one position to another &mdash; they drive gradually
          over a road or glide gracefully over ice.
        </Paragraph>
        <Paragraph>
          In this block, we're going to introduce a simplified version of a very
          powerful algorithm that combines uncertainty of position and
          uncertainty of measurement to make predictions with increased
          confidence: the Kalman filter.
        </Paragraph>
        <GaussianParameterUpdateTutorial />
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default KalmanFilterPage;
