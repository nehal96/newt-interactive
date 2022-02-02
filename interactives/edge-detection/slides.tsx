import { Popover, PopoverContent } from "../../components";

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
    },
    2: {
      text: (
        <>
          <p>2</p>
        </>
      ),
    },
  };
}
