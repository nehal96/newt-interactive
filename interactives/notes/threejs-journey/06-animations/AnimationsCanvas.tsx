import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Euler } from "three";

const Box = ({ slideNumber, ...props }) => {
  const mesh = useRef(null);

  let time = Date.now();

  useFrame(({ clock, camera }) => {
    if (slideNumber === 2) {
      mesh.current.rotation.y += 0.01;
    } else if (slideNumber === 3) {
      const currentTime = Date.now();
      const deltaTime = currentTime - time;
      time = currentTime;

      mesh.current.rotation.y += 0.01 * deltaTime;
    } else if (slideNumber === 4) {
      const elapsedTime = clock.elapsedTime;

      // reset position
      mesh.current.position.x = 0;
      mesh.current.position.y = 0;
      // rotation
      mesh.current.rotation.y = elapsedTime;
    } else if (slideNumber === 5) {
      const elapsedTime = clock.elapsedTime;

      // reset rotation
      mesh.current.rotation.y = 0;
      // reset camera
      camera.position.x = 0;
      camera.position.y = 0;
      // reset camera rotation
      const rotationResetEuler = new Euler(0, 0, 0, "XYZ");
      camera.setRotationFromEuler(rotationResetEuler);
      camera.updateProjectionMatrix();
      // animate position
      mesh.current.position.x = Math.cos(elapsedTime);
      mesh.current.position.y = Math.sin(elapsedTime);
    } else if (slideNumber === 6) {
      const elapsedTime = clock.elapsedTime;

      camera.position.x = Math.cos(elapsedTime);
      camera.position.y = Math.sin(elapsedTime);
      camera.lookAt(mesh.current.position);
      camera.updateProjectionMatrix();
    } else {
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
};

const AnimationsCanvas = ({ slideNumber }: { slideNumber: number }) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera fov={75} position={[0, 0, 3]} />
        <ambientLight />
        <Box slideNumber={slideNumber} />
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
