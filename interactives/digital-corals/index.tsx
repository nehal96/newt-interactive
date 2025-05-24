import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components/InteractiveContainer";
import CoralViewer from "./CoralViewer";

const DigitalCoralSimulator = () => {
  return (
    <InteractiveTutorialContainer>
      <TextContainer className="lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <p>
          Control panel for the digital coral simulator. Interact with the 3D
          view on the right using your mouse to orbit, pan, and zoom.
        </p>
      </TextContainer>
      <InteractiveContainer className="lg:w-1/2">
        <div className="w-full h-96">
          <CoralViewer />
        </div>
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default DigitalCoralSimulator;
