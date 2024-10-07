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
          content="Interactive explainer on the algorithm behind efficiently combining uncertain information to make predictions in a continuously changing 1D environment"
        />
        <meta
          name="keywords"
          content="Kalman filters, uncertainty, predictions, continuous environment, algorithm, interactive explainer"
        />
        <meta property="og:title" content="Kalman Filters / Newt Interactive" />
        <meta
          property="og:description"
          content="Interactive explainer on the algorithm behind efficiently combining uncertain information to make predictions in a continuously changing 1D environment"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta
          property="og:url"
          content="https://newtinteractive.com/blocks/kalman-filters"
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Kalman Filters / Newt Interactive"
        />
        <meta
          name="twitter:description"
          content="Learn about efficiently combining uncertain information to make predictions in a continuously changing 1D environment"
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta name="twitter:creator" content="@nehaludyavar" />
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
