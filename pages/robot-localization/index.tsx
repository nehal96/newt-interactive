import { Navbar, ArticleContainer, Title, Lede } from "../../components";
import { LocalizationSimulation2D } from "../../interactives/robot-localization";

const RobotLocalizationPage = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>How a Self-Driving Car Sees the World</Title>
        <Lede>Part One: Robot Localization</Lede>
        <LocalizationSimulation2D />
      </ArticleContainer>
    </>
  );
};

export default RobotLocalizationPage;
