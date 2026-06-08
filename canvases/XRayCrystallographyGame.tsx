import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const XRayCrystallographyGame = () => {
  return (
    <Canvas
      camera={{
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [6, 6, 6] as [number, number, number],
      }}
    >
      <axesHelper args={[10]} />
      <gridHelper args={[20, 40, "blue", "hotpink"]} />
      <OrbitControls />
    </Canvas>
  );
};

export default XRayCrystallographyGame;
