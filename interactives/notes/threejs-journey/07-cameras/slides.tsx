import { Code, InlineCode } from "../../../../components";

export function getSlides({ fov, setFov, near, setNear, far, setFar }) {
  return {
    1: {
      text: (
        <>
          <p>
            Three.js has several different cameras that create different visual
            representations of a scene.
          </p>
          <p>Click Next to begin viewing and understanding a few of them.</p>
        </>
      ),
    },
    2: {
      text: (
        <>
          <p>
            The first camera we're going to look at is the{" "}
            <span className="font-medium">Perspective Camera</span>.
          </p>
          <p>
            It's the same one that's used previously above, and it's the most
            commonly used camera in rendering a 3D scene.
          </p>
          <p>
            A Perspective Camera renders an approximate representation of an
            image as seen by our eyes.
          </p>
          <p>Let's look at some of the parameters we use to set it up.</p>
        </>
      ),
    },
    3: {
      text: (
        <>
          <ol className="list-outside list-decimal">
            <li className="ml-6 mb-4">
              <span className="font-medium">Field of view</span>: The vertical
              amount of the scene that can be viewed, measured in degrees.
              Default is <InlineCode variant="medium">50</InlineCode>.
            </li>
            <li className="ml-6 mb-4">
              <span className="font-medium">Aspect ratio</span>: The ratio of
              width to height of (usually) the canvas, but you can specify.
            </li>
            <li className="ml-6 mb-4">
              <span className="font-medium">Near</span>: How close the camera
              can see. Any object closer than the value won't be rendered.
              Default is <InlineCode variant="medium">0.1</InlineCode>.
            </li>
            <li className="ml-6 mb-4">
              <span className="font-medium">Far</span>: How far the camera can
              see. Any object further than the value won't be rendered. Default
              is <InlineCode variant="medium">2000</InlineCode>.
            </li>
          </ol>
        </>
      ),
    },
    4: {
      text: (
        <>
          <p>Try playing around with different values below:</p>
          <Code language="jsx">{`<PerspectiveCamera\n  fov={${fov}}\n  aspect={1}\n  near={${near}}\n  far={${far}}\n  position={[0, 0, 3]}\n/>`}</Code>
          <div className="my-6">
            <label className="font-medium">FoV:</label>
            <div className="flex">
              <input
                name="fov"
                type="range"
                value={fov}
                min={1}
                max={100}
                step={1}
                onChange={(e) => setFov(Number(e.target.value))}
                className="flex-auto"
              />
              <span className="w-8 ml-2">{fov}</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="font-medium">Near:</label>
            <div className="flex">
              <input
                name="near"
                type="range"
                value={near}
                min={0.1}
                max={10}
                step={0.1}
                onChange={(e) => setNear(Number(e.target.value))}
                className="flex-auto"
              />
              <span className="w-8 ml-2">{near}</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="font-medium">Far:</label>
            <div className="flex">
              <input
                name="far"
                type="range"
                value={far}
                min={1}
                max={100}
                step={1}
                onChange={(e) => setFar(Number(e.target.value))}
                className="flex-auto"
              />
              <span className="w-8 ml-2">{far}</span>
            </div>
          </div>
        </>
      ),
    },
  };
}
