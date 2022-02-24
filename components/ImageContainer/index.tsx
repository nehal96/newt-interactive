import { DetailedHTMLProps, HTMLAttributes } from "react";

interface ImageContainerProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

const ImageContainer = ({ children, className }: ImageContainerProps) => {
  return (
    <p className={`w-full self-center max-w-4xl mb-8 ${className}`}>
      {children}
    </p>
  );
};

export default ImageContainer;
