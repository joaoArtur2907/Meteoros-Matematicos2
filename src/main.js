// @ts-check
import kaplay from "kaplay";
import { startGame } from "./game";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false,
  background: "#1f102a",
});

startGame(k);
k.go("game");
