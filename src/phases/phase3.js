// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import {
  bulletMeteorCollision,
  MeteorMeteorCollision,
  playerMeteorCollision,
  ShieldBulletCollision,
  ShieldMeteorCollision,
} from "../collisionHandler";
import { nextPhase, phaseStart, startCollisions } from "./phase1";
import { phaseMap } from "./phaseMap";

export function startPhase3(k, player) {
  phaseStart(k, 3);
  k.debug.log("fase 3");

  k.wait(4, () => {
    k.loop(3.5, () => {
      if (!player.storeOpen) createMeteor(k, player);
    });
  });

  createPower(k, 0, player.health);

  let timer = 40;
  k.wait(timer, () => {
    nextPhase(k, player, 1, true);
  });

  startCollisions(k, player);
}
