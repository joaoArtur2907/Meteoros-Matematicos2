// phaseMap.js

import { startPhase1 } from "./phase1";
import { startPhase2 } from "./phase2";
import { startPhase3 } from "./phase3";

export const phaseMap = {
  1: startPhase1,
  2: startPhase2,
  3: startPhase3,
};
