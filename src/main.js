// @ts-check
import kaplay from "kaplay";
import { createGameScenes, startGame } from "./game";
import { createMenu } from "./phases/menu";
import { createPhaseSelector } from "./phases/phaseSelector";
import { createStore } from "./phases/store";
import { createPhase1Scene } from "./phases/phase1";
import { createPhase2Scene } from "./phases/phase2";
import { createPhase3Scene } from "./phases/phase3";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  background: "#1f102a",
});

createMenu(k);
createGameScenes(k);
createPhaseSelector(k);
createStore(k);
createPhase1Scene(k);
createPhase2Scene(k);
createPhase3Scene(k);

k.go("menu");
