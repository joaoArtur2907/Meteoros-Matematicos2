// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import { createPlayer } from "../player";
import {
  phaseStart,
  createBackground,
  startCollisions,
  scrapCounter,
} from "./phaseUtils";

export function createPhase3Scene(k) {
  k.scene("phase3", (data) => {
    createBackground(k);
    let player = createPlayer(k);

    k.onUpdate(() => {
      k.get("scrapCounter").forEach(k.destroy);
      scrapCounter(k, player);
    });

    if (data?.playerState) {
      Object.assign(player, data.playerState);
    }

    phaseStart(k, 3);
    k.debug.log("fase 3");

    if (player.shield) {
      player.activateShield();
    }
    if (player.missile) {
      player.activateMissile();
    }

    k.wait(5, () => {
      k.loop(3.5, () => {
        createMeteor(k, player);
        createMeteor(k, player);
        createMeteor(k, player);
      });
    });

    createPower(k, 0, player.health);

    let timer = 1;

    k.wait(timer, () => {
      const playerState = {
        health: player.health,
        piercingBullet: player.piercingBullet,
        chainExplosion: player.chainExplosion,
        shield: player.shield,
        killingShield: player.killingShield,
        missile: player.missile,
        scraps: player.scraps,
      };

      k.go("store", {
        playerData: playerState,
        nextPhaseNumber: 3,
      });
    });

    startCollisions(k, player);
  });
}
