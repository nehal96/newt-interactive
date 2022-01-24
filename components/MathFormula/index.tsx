import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

const MathFormula = ({ tex, ...props }) => {
  return <TeX math={tex} {...props} />;
};

export default MathFormula;
