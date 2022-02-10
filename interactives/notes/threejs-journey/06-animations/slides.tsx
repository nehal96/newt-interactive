import { Code } from "../../../../components";

export function getSlides() {
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
    },
  };
}
