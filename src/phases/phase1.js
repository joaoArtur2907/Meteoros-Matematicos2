// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import { createPlayer } from "../player";
import {
  createBackground,
  phaseStart,
  scrapCounter,
  startCollisions,
} from "./phaseUtils";
import { createSaw } from "../upgrades/saw";

export function createPhase1Scene(k) {
  k.scene("phase1", (data) => {
    createBackground(k);
    let player = createPlayer(k);

    if (data?.playerState) {
      Object.assign(player, data.playerState);
    }

    k.onUpdate(() => {
      k.get("scrapCounter").forEach(k.destroy);
      scrapCounter(k, player);
    });

    phaseStart(k, 1);
    k.debug.log("fase 1");

    k.wait(2, () => {
      k.loop(4, () => {
        createMeteor(k, player);
      });
    });
    if (player.shield) {
      player.activateShield();
    }
    if (player.missile) {
      player.activateMissile();
    }
    if (player.saw) {
      createSaw(k);
    }

    createPower(k, 0, player.health);

    let timer = 10;
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

      k.go("phase2", {
        playerState: playerState,
      });
    });

    startCollisions(k, player);
  });
}
