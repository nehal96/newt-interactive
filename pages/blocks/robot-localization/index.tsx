import { ArticleContainer, Lede, Navbar, Title } from "../../../components";
import { RobotLocalization } from "../../../interactives/robot-localization";

const RobotLocalizationPage = () => {
  return (
    <>
      <Navbar />
      <ArticleContainer>
        <Title>Simple Robot Localization</Title>
        <Lede>
          The math and algorithm behind how a robot finds its location in a
          simple environment
        </Lede>
        <RobotLocalization />
      </ArticleContainer>
    </>
  );
};

export default RobotLocalizationPage;
