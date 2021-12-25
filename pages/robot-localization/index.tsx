import {
  Navbar,
  ArticleContainer,
  Title,
  Lede,
  InteractiveTutorialContainer,
  InteractiveContainer,
  TextContainer,
} from "../../components";
import { LocalizationSimulation2D } from "../../interactives/robot-localization";

const RobotLocalizationPage = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>How a Self-Driving Car Sees the World</Title>
        <Lede>Part One: Robot Localization</Lede>
        <InteractiveTutorialContainer>
          <TextContainer>
            <p>s</p>
          </TextContainer>
          <InteractiveContainer>
            <LocalizationSimulation2D />
          </InteractiveContainer>
        </InteractiveTutorialContainer>
      </ArticleContainer>
    </>
  );
};

export default RobotLocalizationPage;
