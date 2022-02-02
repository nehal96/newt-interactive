import Head from "next/head";
import {
  ArticleContainer,
  Lede,
  Link,
  Navbar,
  Paragraph,
  Popover,
  PopoverContent,
  Title,
} from "../../../components";
import { EdgeDetectionTutorial } from "../../../interactives/edge-detection";

const EdgeDetectionFilters = () => {
  return (
    <>
      <Head>
        <title>Edge Detection Filters / Newt Interactive</title>
      </Head>
      <Navbar />
      <ArticleContainer>
        <Title>Edge Detection Filters</Title>
        <Lede>kernal convoltions, sobel, cool stuff</Lede>
        <Paragraph>
          If you've ever used Photoshop to generate an outline of an image, or
          used an Instagram/Snapchat/TikTok/Camera filter that creates an
          outline of your face (or your cat's), or seen{" "}
          <Popover
            content={
              <PopoverContent>
                Look at the lane detection UI on the car's display
              </PopoverContent>
            }
          >
            <Link href="https://youtu.be/tlThdr3O5Qo?t=40" toNewTab>
              the dashboard of a Tesla on AutoPilot
            </Link>
          </Popover>
          , you've probably seen some kind of edge detection filter in action.
        </Paragraph>
        <Paragraph>
          Edge detection filters reveal sharp changes in image brightness over a
          short area, and is a fundamental tool in image processing and computer
          vision. In this block, we'll see how a couple of these filters work.
        </Paragraph>
        <EdgeDetectionTutorial />
      </ArticleContainer>
    </>
  );
};

export default EdgeDetectionFilters;
