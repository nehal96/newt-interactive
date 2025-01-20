import {
  CircuitProteinNode,
  LineNode,
  CircleNode,
  CircuitPromoterNode,
  LabelNode,
} from "../../components";

export const CIRCUIT_CONFIG = {
  PROXIMITY_THRESHOLD: 60,
  BUFFER: 2.5,
  ACTIVE_TF_Y_OFFSET: 17,
  NODE_DIMENSIONS: {
    PROTEIN: {
      WIDTH: 30,
      HEIGHT: 30,
      CENTER_OFFSET: 15, // half of width/height
      CIRCLE_RADIUS: 12.5, // actual SVG circle radius
    },
  },
};

export const nodeTypes = {
  circle: CircleNode,
  protein: CircuitProteinNode,
  promoter: CircuitPromoterNode,
  line: LineNode,
  label: LabelNode,
};
