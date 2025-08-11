// @ts-check
import kaplay from "kaplay";
import { startGame } from "./game";
import { createMenu } from "./phases/menu";
import { createPhaseSelector } from "./phases/phaseSelector";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  background: "#1f102a",
});

createMenu(k);
createPhaseSelector(k);

k.go("menu");
