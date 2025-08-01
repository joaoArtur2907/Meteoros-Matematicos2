// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import {
  bulletMeteorCollision,
  playerMeteorCollision,
} from "../collisionHandler";

export function startPhase1(k, player) {
  k.loop(10, () => {
    createMeteor(k, player);
  });

  createPower(k, 0, player.health);

  bulletMeteorCollision(k, player);
  playerMeteorCollision(k, player, {
    shake: true,
    onHitState: true,
  });
}
