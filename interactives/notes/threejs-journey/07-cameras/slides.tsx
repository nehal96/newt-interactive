import { Code, InlineCode, Switch } from "../../../../components";
import { GetSlidesParams, Slides } from "./types";

export function getSlides({
  fov,
  setFov,
  near,
  setNear,
  far,
  setFar,
  showHelper,
  setShowHelper,
}: GetSlidesParams): Slides {
  return {
    1: {
      section: "Intro",
      number: 1,
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
      section: "Perspective Camera intro",
      number: 2,
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
      section: "Perspective Camera parameters",
      number: 3,
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
      section: "Perspective Camera playground",
      number: 4,
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <label className="font-medium mr-8">Enable Camera Helper:</label>
              <span className="text-xs text-slate-500">
                View a diagram of how the Perspective camera views the scene.
                When enabled, use orbit controls to move around and zoom in the
                canvas.
              </span>
            </div>
            <Switch
              checked={showHelper}
              onCheckedChange={(checked) => setShowHelper(checked)}
            />
          </div>
        </>
      ),
    },
    5: {
      section: "Orthographic Camera intro",
      number: 5,
      text: (
        <>
          <p>
            Another camera you can use is the{" "}
            <span className="font-medium">Orthographic camera</span>, which
            renders scenes without perspective. This means the size of the
            object remains the same however far it is from the camera.
          </p>
          <p>
            If you're familiar with isometric art, this is what you can use to
            achieve that effect.
          </p>
          <p>You can try moving around the scene using Orbit controls.</p>
        </>
      ),
    },
    6: {
      section: "Orthographic Camera parameters",
      number: 6,
      text: (
        <>
          <p>Orthographic cameras take a few different parameters:</p>
          <ol className="list-outside list-decimal">
            <li className="ml-6 mb-4">
              <span className="font-medium">Left, right, top, bottom</span>: How
              far the camera can see in each direction. (Use aspect ratio to
              prevent distorted images).
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
  };
}
