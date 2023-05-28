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
        <meta
          name="description"
          content="Interactive explainer on the algorithm behind efficiently combining uncertain information to make predictions"
        />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/"
        />
        <meta property="twitter:title" content="1D Kalman Filters" />
        <meta
          property="twitter:description"
          content="Interactive explainer on the algorithm behind efficiently combining uncertain information to make predictions"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/cg0H2N1/kalman.jpg"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Kalman Filters</Title>
        <Lede>
          How to efficiently combine uncertain information to make predictions
          in a continuously changing 1D environment
        </Lede>
        <Paragraph>
          In the{" "}
          <Link href="/blocks/robot-localization" legacyBehavior>
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
