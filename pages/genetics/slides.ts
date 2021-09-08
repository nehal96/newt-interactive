export type Slide = {
  number: number;
  cameraPosition: [number, number, number];
  text: string;
};
type Slides = Slide[];

const slides: Slides = [
  {
    number: 0,
    cameraPosition: [0, 0, 0],
    text: "Welcome to genetics interactive",
  },
  {
    number: 1,
    cameraPosition: [5, 6, 7],
    text: "This is slide 1, which will provide some info on the model",
  },
  {
    number: 2,
    cameraPosition: [1, 1, 1],
    text: "Slide #2",
  },
];

export default slides;
