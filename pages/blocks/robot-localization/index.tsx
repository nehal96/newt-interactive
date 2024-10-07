import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  Title,
  OrderedList,
  PostArticleSubscribe,
} from "../../../components";
import { RobotLocalization } from "../../../interactives/robot-localization";

const RobotLocalizationPage = () => {
  return (
    <>
      <Head>
        <title>Simple Robot Localization / Newt Interactive</title>
        <meta
          name="description"
          content="Explore an interactive explainer on how robots find their location in a simple environment. Learn about sensing, movement, and the algorithm behind robot localization."
        />
        <meta
          name="keywords"
          content="robot localization, interactive explainer, sensing, movement, algorithm, robotics"
        />
        <meta
          property="og:title"
          content="Simple Robot Localization / Newt Interactive"
        />
        <meta
          property="og:description"
          content="Explore an interactive explainer on how robots find their location in a simple environment. Learn about sensing, movement, and the algorithm behind robot localization."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta
          property="og:url"
          content="https://www.newtinteractive.com/blocks/robot-localization"
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Simple Robot Localization / Newt Interactive"
        />
        <meta
          name="twitter:description"
          content="Learn about the algorithm behind how robots find their location in a simple environment through an interactive explainer."
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/NpXN5rj/Meta-tag-image-1.png"
        />
        <meta name="twitter:creator" content="@nehaludyavar" />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Simple Robot Localization</Title>
        <Lede>
          The algorithm behind how a robot finds its location in a simple
          environment
        </Lede>
        <Paragraph>
          All robots, from the cute little toy dogs and Roombas to self-driving
          cars, have to be able to understand the environment they're in and
          move around in it. They might use infrared sensors, lasers, or cameras
          to perceive their surroundings, and might use legs, wheels, or
          propellers to move around, but regardless of their configuration, they
          follow a similar cycle &mdash; gather data by <i>sensing</i> their
          environment, perform some calculation, and <i>move</i>.
        </Paragraph>
        <Paragraph>
          In the interactive explainer below, we're going to see how this works
          in a very simplified environment. There are several characteristics
          that make the situation simple:
        </Paragraph>
        <OrderedList>
          <li>The robot's world is two-dimensional</li>
          <li>
            The robot's movement is <b>discrete</b>, rather than continuous.
            This means that the robot instantly jumps from one cell to another,
            rather than drives or walks there.
          </li>
        </OrderedList>
        <Paragraph>
          The interactive below has three sections: a general overview, a
          walkthrough explaining the algorithm, and a playground to experiment.
          Enjoy!
        </Paragraph>
        <RobotLocalization />
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default RobotLocalizationPage;
