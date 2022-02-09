import { Code } from "../../../../components";

export function getSlides() {
  return {
    1: {
      text: (
        <>
          <p>The setup: no animation</p>
        </>
      ),
    },
    2: {
      text: (
        <>
          <p>Animating by manually changing mesh rotation:</p>
          <Code
            variant="dark"
            className="mb-4"
          >{`const mesh = useRef(null)\n\nuseFrame(() => {\n  mesh.current.rotation.y += 0.01\n})\n\n// Box code\n...`}</Code>
        </>
      ),
    },
  };
}
