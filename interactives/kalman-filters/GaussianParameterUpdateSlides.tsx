import { TextContainer, Button } from "../../components";
import styles from "./styles.module.css";

const GaussianParameterUpdateSlides = ({
  slide,
  slideNumber,
  totalSlides,
  onBack,
  onNext,
  onReset,
}) => {
  return (
    <TextContainer className="lg:w-2/5">
      <div className="flex items-center justify-end text-slate-400 mb-6">
        <div>
          <Button
            variant="outline"
            className="mr-2 text-xs hover:text-slate-500 md:mr-4 md:text-sm"
            onClick={onReset}
          >
            Reset
          </Button>
          <span className="text-xs md:text-sm">{`${slideNumber} / ${totalSlides}`}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          {/* Slide text */}
          <div className={styles["slide-text"]}>
            {slide?.text ? slide.text : null}
          </div>
        </div>
        {/* Back + Next buttons */}
        <div className="flex justify-center">
          {slideNumber > 1 ? (
            <Button
              variant="secondary"
              className="mr-2 px-4"
              onClick={() => onBack(slide?.onBack)}
            >
              Back
            </Button>
          ) : null}
          {slideNumber < totalSlides ? (
            <Button
              variant="secondary"
              className="ml-2 px-4"
              onClick={() => onNext(slide?.onNext)}
            >
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </TextContainer>
  );
};

export default GaussianParameterUpdateSlides;
