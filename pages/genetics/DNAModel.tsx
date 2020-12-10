import { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";

const DNAModel = () => {
  const mesh = useRef();

  useFrame(() => {
    // @ts-ignore
    mesh.current.rotation.x = mesh.current.rotation.y += 0.03;
  });

  return (
    <>
      <ambientLight />
      <mesh ref={mesh}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#38ceff" />
      </mesh>
    </>
  );
};

export default DNAModel;
