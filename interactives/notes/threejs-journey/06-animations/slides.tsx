import { Euler } from "three";
import { Code } from "../../../../components";
import { Slides } from "./types";

export function getSlides(): Slides {
  return {
    1: {
      section: "Static",
      text: (
        <>
          <p>The setup: no animation</p>
        </>
      ),
    },
    2: {
      section: "Manual rotation",
      text: (
        <>
          <p>Animating by manually changing mesh rotation:</p>
          <Code variant="dark" className="mb-4">
            {`const mesh = useRef(null)\n\nuseFrame(() => {\n  mesh.current.rotation.y += 0.01\n})\n\n// Box code\n...`}
          </Code>
        </>
      ),
      code: ({ mesh }) => {
        mesh.current.rotation.y += 0.01;
      },
    },
    3: {
      section: "Animating at frame rate",
      text: (
        <>
          <p>Adapting animation to framerate</p>
          <Code variant="dark" className="mb-4">
            {`const mesh = useRef(null)\nlet time = Date.now()\n\nuseFrame(() => {\n  const currentTime = Date.now()\n  const deltaTime = currentTime - time\n  time = currentTime\n\n  mesh.current.rotation.y += 0.01 * deltaTime\n})\n\n// Box code\n...`}
          </Code>
        </>
      ),
      code: ({ mesh, time, setTime }) => {
        const currentTime = Date.now();
        const deltaTime = currentTime - time;
        setTime(currentTime);

        mesh.current.rotation.y += 0.01 * deltaTime;
      },
    },
    4: {
      section: "Animating with Three.js Clock",
      text: (
        <>
          <p>Using Three.js Clock:</p>
          <Code variant="dark" className="mb-4">
            {`const mesh = useRef(null)\n\nuseFrame(({ clock }) => {\n  const elapsedTime = clock.elapsedTime;\n\n  mesh.current.rotation.y = elapsedTime;\n})\n\n// Box code\n...`}
          </Code>
        </>
      ),
      code: ({ mesh, clock }) => {
        const elapsedTime = clock.elapsedTime;

        // reset position
        mesh.current.position.x = 0;
        mesh.current.position.y = 0;
        // rotation
        mesh.current.rotation.y = elapsedTime;
      },
    },
    5: {
      section: "Animating with Clock and trigonometry",
      text: (
        <>
          <p>Clock + trigonometry</p>
          <Code variant="dark" className="mb-4">
            {`const mesh = useRef(null)\n\nuseFrame(({ clock }) => {\n  const elapsedTime = clock.elapsedTime;\n\n  mesh.current.position.x = Math.cos(elapsedTime);\n  mesh.current.position.y = Math.sin(elapsedTime);\n})\n\n// Box code\n...`}
          </Code>
        </>
      ),
      code: ({ mesh, clock, camera }) => {
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
      },
    },
    6: {
      section: "Animating the camera",
      text: (
        <>
          <p>Clock + trigonometry for camera</p>
          <Code variant="dark" className="mb-4">
            {`const mesh = useRef(null)\n\nuseFrame(({ clock, camera }) => {\n  const elapsedTime = clock.elapsedTime;\n\n  camera.position.x = Math.cos(elapsedTime);\n  camera.position.y = Math.sin(elapsedTime);\n  camera.lookAt(mesh.current.position);\n  camera.updateProjectionMatrix();\n})\n\n// Box code\n...`}
          </Code>
        </>
      ),
      code: ({ mesh, clock, camera }) => {
        const elapsedTime = clock.elapsedTime;

        camera.position.x = Math.cos(elapsedTime);
        camera.position.y = Math.sin(elapsedTime);
        camera.lookAt(mesh.current.position);
        camera.updateProjectionMatrix();
      },
    },
  };
}
