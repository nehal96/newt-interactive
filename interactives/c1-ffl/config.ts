import {
  CircuitProteinNode,
  LineNode,
  CircleNode,
  CircuitPromoterNode,
} from "../../components";

export const CIRCUIT_CONFIG = {
  PROXIMITY_THRESHOLD: 40,
  BUFFER: 2.5,
  ACTIVE_TF_Y_OFFSET: 17,
};

export const nodeTypes = {
  circle: CircleNode,
  protein: CircuitProteinNode,
  promoter: CircuitPromoterNode,
  line: LineNode,
};
