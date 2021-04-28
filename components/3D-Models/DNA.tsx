import { lazy } from "react";
import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";

// Loading GLTF files in Next is a mess (can't be in pages), so here's a
// commit that works
// https://github.com/pmndrs/react-three-fiber/discussions/504
const DNAModel = lazy(() => import("../../r3f-models/DNA-DoubleHelix"));

interface DNA {
  exploreMode?: Boolean;
}

const DNA = ({ exploreMode }: DNA) => {
  useFrame((state) => {
    if (!exploreMode) {
      state.camera.position.lerp(new Vector3(5, 6, 5), 0.1);
      state.camera.lookAt(0, 2, 0);
      state.camera.updateProjectionMatrix();
    }
  });

  return <DNAModel />;
};

DNA.defaultProps = {
  exploreMode: true,
};

export default DNA;