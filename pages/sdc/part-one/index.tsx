import { Navbar, ArticleContainer, Title, Lede } from "../../../components";
import LocalizationSimulation2DTutorial from "../../../interactives/robot-localization/LocalizationSimulation2DTutorial";

const RobotLocalizationPage = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>How a Self-Driving Car Sees the World</Title>
        <Lede>Part One: Robot Localization</Lede>
        <LocalizationSimulation2DTutorial />
      </ArticleContainer>
    </>
  );
};

export default RobotLocalizationPage;
