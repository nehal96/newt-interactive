import Image from "next/image";
import { useState } from "react";
import { Button } from "..";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface ImageSeriesProps {
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: React.ReactNode;
  }[];
  maxWidth?: string;
}

const ImageSeries: React.FC<ImageSeriesProps> = ({
  images,
  maxWidth = "550px",
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col items-center mt-4 mb-12">
      <div
        className={`max-w-[${maxWidth}] w-full mx-auto ${
          currentImage === 0 ? "mb-4 md:mb-5" : "mb-1"
        }`}
      >
        <Image
          src={images[currentImage].src}
          alt={images[currentImage].alt}
          width={images[currentImage].width || 500}
          height={images[currentImage].height || 500}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
      {images[currentImage].caption && (
        <div className="max-w-[550px] w-full mx-auto text-center my-2 text-xs text-gray-500">
          {images[currentImage].caption}
        </div>
      )}
      {images.length > 1 && (
        <>
          <div className="flex justify-center mt-4 mb-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentImage ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center w-full max-w-[550px] mt-2">
            <Button
              variant="secondary"
              onClick={handlePrev}
              className="mr-4"
              disabled={currentImage === 0}
            >
              <FiArrowLeft size={18} className="my-1" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={currentImage === images.length - 1}
            >
              <FiArrowRight size={18} className="my-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSeries;
