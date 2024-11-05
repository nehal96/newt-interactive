import { SlideDeck, MathFormula } from "../../components";

const FormulaReview = () => {
  const slides = [
    {
      section: "Review",
      text: (
        <>
          <p>
            Click Next to go through a review of the key formulas and concepts
            related to transcription network dynamics. Optionally, you can
            select the specific review from the selection menu above, or skip it
            entirely if you don't require it.
          </p>
        </>
      ),
    },
    {
      section: "Review: Transcription Dynamics",
      text: (
        <>
          <p>
            The transcription dynamics equation describes how the concentration
            of a protein changes over time based on its production and removal
            rates.
          </p>

          <div className="flex flex-col justify-center mt-6 mb-4 mx-auto">
            <MathFormula tex="\dfrac{dX}{dt} = f(X^*) - \alpha X^*" />
          </div>

          <p>Where:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <MathFormula variant="small" tex="X^*" /> is the protein
              concentration
            </li>
            <li>
              <MathFormula variant="small" tex="f(X^*)" /> is the input function
              (usually the Hill function or step function for approximation)
            </li>
            <li>
              <MathFormula variant="small" tex="\alpha" /> is the protein
              removal rate
            </li>
          </ul>
        </>
      ),
    },
    {
      section: "Review: Hill Function for Repressors",
      text: (
        <>
          <p>
            The Hill function for a repressor describes how a transcription
            factor inhibits gene expression. As the repressor concentration
            increases, gene expression decreases.
          </p>

          <div className="flex flex-col justify-center mt-6 mb-4 mx-auto">
            <MathFormula tex="f(X^*) = \beta \cdot \dfrac{K^n}{K^n + X^{*n}}" />
          </div>

          <p>Where:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <MathFormula variant="small" tex="X^*" /> is the repressor
              concentration
            </li>
            <li>
              <MathFormula variant="small" tex="K" /> is the activation
              coefficient (concentration of{" "}
              <MathFormula variant="small" tex="X^*" /> needed to significantly
              activate expression)
            </li>
            <li>
              <MathFormula tex="n" /> is the Hill coefficient (determines
              response steepness)
            </li>
          </ul>
        </>
      ),
    },
    {
      section: "Review: Step Function",
      text: (
        <>
          <p>
            The step function is a simple approximation of the Hill function for
            repressors, described by:
          </p>
          <div className="flex flex-col justify-center my-6 mx-auto">
            <MathFormula tex="f(X^*) = \beta \cdot \theta(X^* < K)" />
          </div>
          <p>
            where the production is either 0 or at its maximum{" "}
            <MathFormula tex="\beta" /> depending on whether the active
            concentration <MathFormula tex="X^*" /> is less than the threshold
            concentration <MathFormula tex="K" /> or not. The simplified
            function makes evaluating calculations easier while keeping the same
            behavior.
          </p>
        </>
      ),
    },
    {
      section: "Review: All Formulas",
      text: (
        <>
          <div className="grid grid-cols-[min-content_minmax(0,_1fr)] xs:grid-cols-2 grid-rows-3 gap-y-6 gap-x-4">
            <p className="self-center font-medium">Transcription Dynamics</p>
            <MathFormula
              className="self-center justify-self-center xs:justify-self-start"
              tex="\dfrac{dX}{dt} = f(X^*) - \alpha X^*"
            />
            <p className="self-center font-medium">Hill Function (Repressor)</p>
            <MathFormula
              className="self-center justify-self-center xs:justify-self-start"
              tex="f(X^*) = \beta \cdot \dfrac{K^n}{K^n + X^{*n}}"
            />
            <p className="self-center font-medium">Step Function</p>
            <MathFormula
              className="self-center justify-self-center xs:justify-self-start"
              tex="f(X^*) = \beta \cdot \theta(X^* < K)"
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <SlideDeck
      slides={slides}
      textContainerClass="w-full max-w-prose self-center md:mx-0 my-0"
      interactiveContainerClass="hidden"
    />
  );
};

export default FormulaReview;
