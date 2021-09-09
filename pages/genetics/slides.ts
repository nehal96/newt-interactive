export type Slide = {
  number: number;
  cameraPosition: [number, number, number];
  text: string;
  exploreMode: boolean;
};
type Slides = Slide[];

const slides: Slides = [
  {
    number: 0,
    cameraPosition: [5, 6, 5],
    text: "Welcome to genetics interactive",
    exploreMode: true,
  },
  {
    number: 1,
    cameraPosition: [5, 6, 7],
    text: "This is slide 1, which will provide some info on the model",
    exploreMode: false,
  },
  {
    number: 2,
    cameraPosition: [1, 1, 1],
    text: "Oooh look at this close-up",
    exploreMode: false,
  },
  {
    number: 3,
    cameraPosition: [5, 6, 5],
    text: "All done. Feel free to explore!",
    exploreMode: true,
  },
];

export default slides;
