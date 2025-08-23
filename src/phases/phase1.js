// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import {
  bulletMeteorCollision,
  MeteorMeteorCollision,
  MissileMeteorCollision,
  playerMeteorCollision,
  ShieldBulletCollision,
  ShieldMeteorCollision,
} from "../collisionHandler";
import { startPhase2 } from "./phase2";
import { phaseMap } from "./phaseMap";
import { createStore } from "./store";

export function startCollisions(k, player) {
  bulletMeteorCollision(k, player);
  playerMeteorCollision(k, player);
  MeteorMeteorCollision(k, player);
  ShieldMeteorCollision(k, player);
  ShieldBulletCollision(k, player);
  MissileMeteorCollision(k, player);
}

export function nextPhase(k, player, phase, store) {
  k.destroyAll("meteor");
  createStore(k, player);

  const overlay = k.add([
    k.rect(1280, 720),
    k.color(k.BLACK),
    k.pos(0, 0),
    k.opacity(0.1),
    "overlay",
    { z: 100 },
  ]);

  overlay.onUpdate(() => {
    if (overlay.opacity < 1) {
      overlay.opacity += k.dt() * 0.2;
    } else {
      if (store) {
        k.go("store");
      } else {
        phaseMap[phase](k, player);
        overlay.destroy();
      }
    }
  });
}

export function phaseStart(k, phase) {
  const phaseName = k.add([
    k.text("FASE " + phase, {
      font: "Silkscreen",
      size: 108,
    }),
    k.pos(k.center().x, 200),
    k.anchor("center"),
  ]);
  const overlay = k.add([
    k.rect(1280, 720),
    k.color(k.BLACK),
    k.pos(0, 0),
    k.opacity(1),
    "overlay",
    { z: 100 },
  ]);

  overlay.onUpdate(() => {
    overlay.opacity -= k.dt() * 0.2;

    if (overlay.opacity <= 0) {
      overlay.destroy();
      phaseName.destroy();
    }
  });
}

export function startPhase1(k, player) {
  phaseStart(k, 1);
  k.debug.log("fase 1");

  k.wait(5, () => {
    k.loop(4, () => {
      createMeteor(k, player);
    });
  });

  createPower(k, 0, player.health);

  let timer = 4;

  k.wait(timer, () => {
    nextPhase(k, player, 2, false);
  });

  startCollisions(k, player);
}
