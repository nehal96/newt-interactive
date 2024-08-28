import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Navbar,
  Paragraph,
  PostArticleSubscribe,
  Title,
} from "../../../components";
import { HemoglobinStructureTutorial } from "../../../interactives/essays/hemoglobin";

const HemoglobinEssayPage = () => {
  return (
    <>
      <Head>
        <title>Hemoglobin / Newt Interactive</title>
        <meta name="description" content="Interactive essay on hemoglobin" />
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@nehaludyavar" />
        <meta
          property="twitter:url"
          content="https://www.newtinteractive.com/"
        />
        <meta property="twitter:title" content="The Story of Hemoglobin" />
        <meta
          property="twitter:description"
          content="Interactive essay on hemoglobin"
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/cg0H2N1/kalman.jpg"
        />
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>The Story of Hemoglobin</Title>
        <Lede>
          How a special protein in red blood cells transports oxygen around your
          body
        </Lede>
        <Paragraph>
          It might not seem or feel like it, but, at the cellular level, we are
          mostly blood. Over three-quarters of all the cells in our body are the
          20-30 trillion red blood cells floating in arteries and veins and
          squeezing between capillaries. In adults, 2.4 million are produced
          every second, and they tirelessly circulate our body for 3-4 months,
          before they’re recycled for parts by our liver (with assistance from
          our spleen). A single red blood cell contains an estimated 270 million
          hemoglobin molecules, which when multiplied with the trillions of red
          blood cells we have is… a lot of hemoglobin. A single circulation
          takes about a minute, so each red blood cell will ferry oxygen
          150,000-200,000 times. Providing oxygen efficiently to every part of
          our body is vital to our existence, so maybe it should not come as a
          surprise that a significant part of us is devoted to oxygen
          transportation networks, but the sheer numbers are mind-boggling.
        </Paragraph>
        <Paragraph>
          Hemoglobin is a marvel of precision engineering. When a red blood
          cell, chock full of hemoglobin, fills up on oxygen at the lungs and is
          pumped by the heart across the body, there is no GPS system that tells
          it where to go. But, generally, every part of you manages to receive
          the right amount of oxygen all the time; hemoglobin must not only know
          how to grab onto oxygen, but also when to let it go. What kind of
          structure could possibly solve that complex but vital problem?
        </Paragraph>
        <HemoglobinStructureTutorial />
        <PostArticleSubscribe />
      </ArticleContainer>
    </>
  );
};

export default HemoglobinEssayPage;
