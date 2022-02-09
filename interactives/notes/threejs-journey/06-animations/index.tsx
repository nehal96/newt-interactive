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
        <InteractiveContainer className="w-[400px] h-[400px]">
          <AnimationsCanvas />
        </InteractiveContainer>
      </InteractiveTutorialContainer>
    </>
  );
};

export default Animations;
