import {
  InteractiveTutorialContainer,
  InteractiveContainer,
  TextContainer,
} from "../../components";
import GaussianParameterUpdateChart from "./GaussianParameterUpdateChart";

const GaussianParameterUpdateTutorial = () => {
  return (
    <InteractiveTutorialContainer>
      <TextContainer className="lg:w-2/5" />
      <InteractiveContainer className="lg:w-3/5">
        <GaussianParameterUpdateChart />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default GaussianParameterUpdateTutorial;
