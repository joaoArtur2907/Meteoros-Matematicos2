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
import { nextPhase, phaseStart } from "./phase1";
import { phaseMap } from "./phaseMap";

export function startPhase2(k, player) {
  phaseStart(k, 2);
  k.debug.log("fase 2");
  k.wait(5, () => {
    k.loop(3.5, () => {
      createMeteor(k, player);
    });
  });

  // createPower(k, 0, player.health);

  let timer = 3;

  k.wait(timer, () => {
    nextPhase(k, player, 1, true);
  });

  bulletMeteorCollision(k, player);
  playerMeteorCollision(k, player);
  MeteorMeteorCollision(k, player);
  ShieldMeteorCollision(k, player);
  ShieldBulletCollision(k, player);
}
