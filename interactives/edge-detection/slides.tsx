import { InlineCode, Popover, PopoverContent } from "../../components";
import slsAmgPic from "../../public/images/sls-amg-black-series.jpeg";
import slsAmgWithGrayscaleValuesPic from "../../public/images/sls-amg-with-grayscale-values.png";

export function getSlides() {
  return {
    1: {
      text: (
        <>
          <p>
            Here we have a greyscale image of a{" "}
            <Popover
              content={
                <PopoverContent>
                  Why this image? Because it's one of my all-time favorite cars
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              Mercedes-Benz SLS AMG Black Series.
            </Popover>
          </p>
          <p>We're using a grayscale image for two main reasons:</p>
          <ol className="list-decimal list-outside ml-4 mb-4 text-slate-800">
            <li className="mb-3">
              it reduces dimensionality from 3 to 1 &mdash; color images on
              screens are made up of red, green, and blue layers
            </li>
            <li>
              it emphasizes the difference in intensity better, which we'll soon
              see is quite important.
            </li>
          </ol>
        </>
      ),
      imgSrc: slsAmgPic,
    },
    2: {
      text: (
        <>
          <p>
            Grayscale pixels can be displayed by just one number representing
            intensity &mdash;{" "}
            <InlineCode className="bg-black text-white">0</InlineCode>{" "}
            representing black,{" "}
            <InlineCode className="bg-white text-black">255</InlineCode>{" "}
            representing white, and a gradient of 'grays' in between.
          </p>
          <p>
            In the picture, you can see these values for a small{" "}
            <InlineCode>4x4</InlineCode> section on the roof of the car. There's
            a distinct jump between the white of the car and the grays of the
            mountain backdrop &mdash; an edge.
          </p>
          <p>
            In the coming slides, we're going to see how we can make these edges
            more visually prominent.
          </p>
        </>
      ),
      imgSrc: slsAmgWithGrayscaleValuesPic,
    },
  };
}
