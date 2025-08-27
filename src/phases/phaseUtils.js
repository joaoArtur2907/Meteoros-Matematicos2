import kaplay from "kaplay";
import {
  bulletMeteorCollision,
  MeteorMeteorCollision,
  MissileMeteorCollision,
  playerMeteorCollision,
  SawMeteorCollision,
  ShieldBulletCollision,
  ShieldMeteorCollision,
} from "../collisionHandler";

export function scrapCounter(k, player) {
  k.add([
    k.text(player.scraps, {
      font: "Silkscreen",
      size: 24,
      width: 190,
      align: "center",
    }),
    k.pos(100, 100),
    "scrapCounter",
    k.anchor("center"),
    k.color(k.Color.fromHex("#FFD700")),
  ]);
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
        k.go("phase2");
        overlay.destroy();
      }
    }
  });
}

export function startCollisions(k, player) {
  bulletMeteorCollision(k, player);
  playerMeteorCollision(k, player);
  MeteorMeteorCollision(k, player);
  ShieldMeteorCollision(k, player);
  ShieldBulletCollision(k, player);
  MissileMeteorCollision(k, player);
  SawMeteorCollision(k, player);
}

export function createBackground(k) {
  k.loadSprite("bg", "/assets/bg3.png");
  const SPEED = 5500;
  const bg1 = k.add([
    k.sprite("bg"),
    k.pos(0, 0),
    k.scale(k.width() / 1280, k.height() / 720),
    "bg",
  ]);

  const bg2 = k.add([
    k.sprite("bg"),
    k.pos(0, -k.height()),
    k.scale(k.width() / 1280, k.height() / 720),
    "bg",
  ]);

  k.onUpdate(() => {
    bg1.move(0, SPEED * k.dt());
    bg2.move(0, SPEED * k.dt());

    // Quando sair da tela, reposiciona para cima
    if (bg1.pos.y >= k.height()) {
      bg1.pos.y = bg2.pos.y - k.height();
    }

    if (bg2.pos.y >= k.height()) {
      bg2.pos.y = bg1.pos.y - k.height();
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
