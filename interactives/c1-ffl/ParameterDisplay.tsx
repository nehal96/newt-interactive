import { MathFormula, Slider, Accordion } from "../../components";
import { UseSimulationReturn } from "./types";

const ParametersDisplay = ({
  params,
  updateParams,
}: Pick<UseSimulationReturn, "params" | "updateParams">) => {
  return (
    <div className="w-1/2 lg:mt-4 mb-4 lg:mb-0">
      <Accordion
        title="Parameters"
        className="bg-slate-50 p-6"
        showTitleIcon={false}
      >
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-sm font-mono mb-2">Protein Y:</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <MathFormula tex="\alpha_Y" />
                  <span className="flex items-end">
                    {params.alphaY.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[params.alphaY]}
                  onValueChange={([value]) => updateParams({ alphaY: value })}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <MathFormula tex="\beta_Y" />
                  <span className="flex items-end">
                    {params.betaY.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[params.betaY]}
                  onValueChange={([value]) => updateParams({ betaY: value })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <MathFormula tex="K_{YZ}" />
                  <span className="flex items-end">
                    {params.Kyz.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[params.Kyz]}
                  onValueChange={([value]) => updateParams({ Kyz: value })}
                  min={1}
                  max={10}
                  step={0.5}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-mono mb-2">Protein Z:</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <MathFormula tex="\alpha_Z" />
                  <span className="flex items-end">
                    {params.alphaZ.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[params.alphaZ]}
                  onValueChange={([value]) => updateParams({ alphaZ: value })}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <MathFormula tex="\beta_Z" />
                  <span className="flex items-end">
                    {params.betaZ.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[params.betaZ]}
                  onValueChange={([value]) => updateParams({ betaZ: value })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default ParametersDisplay;
