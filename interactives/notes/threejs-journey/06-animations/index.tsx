import dynamic from "next/dynamic";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
} from "../../../../components";

const AnimationsCanvas = dynamic(() => import("./AnimationsCanvas"), {
  ssr: false,
});

const Animations = () => {
  return (
    <>
      <InteractiveTutorialContainer>
        <InteractiveContainer>
          <AnimationsCanvas />
        </InteractiveContainer>
      </InteractiveTutorialContainer>
    </>
  );
};

export default Animations;
