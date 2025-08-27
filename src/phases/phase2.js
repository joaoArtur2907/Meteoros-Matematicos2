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
import { createSaw } from "../upgrades/saw";

export function createPhase2Scene(k) {
  k.scene("phase2", (data) => {
    createBackground(k);
    let player = createPlayer(k);

    k.onUpdate(() => {
      k.get("scrapCounter").forEach(k.destroy);
      scrapCounter(k, player);
    });

    if (data?.playerState) {
      Object.assign(player, data.playerState);
    }

    phaseStart(k, 2);
    k.debug.log("fase 2");

    let dashCooldown;

    if (player.shield) {
      player.activateShield();
    }
    if (player.missile) {
      player.activateMissile();
      dashCooldown = k.add([
        k.text(10, {
          font: "Silkscreen",
          size: 24,
          width: 190,
          align: "center",
        }),
        {
          value: player.superDashCooldown,
        },
        k.pos(100, 300),
        "dashCooldown",
        k.anchor("center"),
        k.color(k.Color.fromHex("#FFD700")),
      ]);

      k.onUpdate(() => {
        dashCooldown.value -= 1;
        dashCooldown.text = dashCooldown.value;
      });
    }
    if (player.saw) {
      createSaw(k);
    }

    k.wait(2, () => {
      k.loop(3.5, () => {
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
