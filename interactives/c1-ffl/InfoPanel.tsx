import { Accordion } from "../../components";

export default function InfoPanel() {
  return (
    <div className="w-1/2 lg:mt-4 mb-4 lg:mb-0">
      <Accordion title="Guide" className="bg-slate-50 p-6">
        <div className="space-y-3">
          <div>
            <p className="font-medium mb-1">Circuit Elements:</p>
            <ul className="text-base">
              <li>
                <span className="font-medium">Sx</span>: Signal molecule for X
                (draggable)
              </li>
              <li>
                <span className="font-medium">X, Y, Z</span>: Proteins (*
                represents activated)
              </li>
              <li>
                <span className="font-medium">Line</span>: Gene
              </li>
              <li>
                <span className="font-medium">Boxes</span>: Promoters
              </li>
              <li>
                <span className="font-medium">Arrows</span>: Activation paths
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Quick Start:</p>
            <ol className="text-base list-decimal list-inside">
              <li>Drag Sx near X to activate</li>
              <li>Press Run to start</li>
              <li>
                Watch protein levels in graphs (delays in Z production shown by
                yellow boxes)
              </li>
              <li>Move Sx in or out, or change parameters to see effects</li>
            </ol>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
