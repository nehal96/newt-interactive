import { lazy } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const HemoglobinModel = lazy(() => import("../../r3f-models/Hemoglobin"));

interface Hemoglobin {
  exploreMode?: Boolean;
}

const Hemoglobin = ({ exploreMode = true }: Hemoglobin) => {
  const vec = new Vector3(5, 6, 5);

  useFrame((state) => {
    if (!exploreMode) {
      state.camera.position.lerp(vec, 0.1);
      state.camera.lookAt(0, 2, 0);
      state.camera.updateProjectionMatrix();
    }
  });

  return <HemoglobinModel />;
};

export default Hemoglobin;
