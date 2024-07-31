import { Euler } from "three";
import { Code } from "../../../../components";
import BoxAnimationsPlayground from "./Playground";
import { GetSlidesParams, Slides } from "./types";

export function getSlides({
  boxArgs,
  setBoxArgs,
  rps,
  setRps,
  enableOrbitControls,
  setEnableOrbitControls,
}: GetSlidesParams): Slides {
  return {
    1: {
      section: "Static",
      number: 1,
      text: (
        <>
          <p>A yellow box, black background, no animation.</p>
          <p>
            Click Next or the section dropdown above to view different ways of
            animating the box.
          </p>
        </>
      ),
    },
    2: {
      section: "Manual rotation",
      number: 2,
      text: (
        <>
          <p>Animating by manually changing mesh rotation:</p>
          <Code language="jsx" className="mb-4">
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
      number: 3,
      text: (
        <>
          <p>Adapting animation to framerate:</p>
          <Code language="jsx" className="mb-4">
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
      number: 4,
      text: (
        <>
          <p>Animating using Three.js Clock:</p>
          <Code language="jsx" className="mb-4">
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
      number: 5,
      text: (
        <>
          <p>Animating with Three.js Clock and trigonometry:</p>
          <Code language="jsx" className="mb-4">
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
      number: 6,
      text: (
        <>
          <p>Animating the camera with Three.js Clock and trigonometry:</p>
          <Code language="jsx" className="mb-4">
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
    7: {
      section: "Playground",
      number: 7,
      text: (
        <BoxAnimationsPlayground
          boxArgs={boxArgs}
          setBoxArgs={setBoxArgs}
          rps={rps}
          setRps={setRps}
          enableOrbitControls={enableOrbitControls}
          setEnableOrbitControls={setEnableOrbitControls}
        />
      ),
      code: ({ mesh, time, setTime }) => {
        const currentTime = Date.now();
        const deltaTime = currentTime - time;
        setTime(currentTime);

        // one rotation per second
        const rotation = (2 * Math.PI * deltaTime) / 1000;

        mesh.current.rotation.y += rps * rotation;
      },
    },
  };
}
