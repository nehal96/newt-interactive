import { cn } from "../../lib/utils";
import { CodeVariant, getStyles } from "./helpers";
interface InlineCodeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  variant?: CodeVariant;
}

const InlineCode = ({
  children,
  className,
  variant,
  ...props
}: InlineCodeProps) => {
  return (
    <code
      className={cn("px-1 py-0.5 rounded-md", getStyles(variant), className)}
      {...props}
    >
      {children}
    </code>
  );
};

export default InlineCode;
