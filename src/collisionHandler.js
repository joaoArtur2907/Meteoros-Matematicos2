// @ts-check
import kaplay from "kaplay";
import { createPower } from "./power";

function upgradeBulletKill(k, bullet) {
  bullet.instaKill = true;
  bullet.color = k.Color.fromHex("#D21A1E");
}

export function killMeteor(k, meteor) {
  if (meteor.state === "dead") return;

  meteor.enterState("dead");

  k.play("meteorHit2", {
    volume: 0.5,
    speed: 1,
  });

  k.wait(0.8).then(() => {
    k.destroy(meteor);
  });
}

export function bulletMeteorCollision(k, player) {
  k.loadSound("wrong", "/assets/meteor_wrong_hit.wav");
  k.loadSound("playerHit", "/assets/player_hit_by_meteor.wav");
  k.loadSound("meteorHit2", "/assets/meteoro_morte_explosao.wav");

  k.onCollide("meteor", "bullet", (meteor, bullet) => {
    const operations = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "%": (a, b) => a % b,
    };

    const result = operations[meteor.operation]?.(
      meteor.firstNumOp,
      meteor.secondNumOp
    );

    if (bullet.value == result || bullet.instaKill) {
      killMeteor(k, meteor);
      player.scraps += meteor.scrapValue;
      k.debug.log(player.scraps);

      if (player.piercingBullet) {
        upgradeBulletKill(k, bullet);
      } else {
        k.destroy(bullet);
      }
    } else {
      k.play("wrong", {
        volume: 0.5,
        speed: 1,
      });
      meteor.enterState("hit");
      k.destroy(bullet);
    }
  });
}

export function playerMeteorCollision(k, player) {
  k.onCollide("player", "meteor", (player, meteor) => {
    k.shake(50);

    if (!player.superDashActive) {
      player.health -= 1;
      k.play("playerHit", {
        volume: 0.5,
        speed: 1,
      });
      player.enterState("hit");

      k.get("power").forEach(k.destroy);
      createPower(k, 0, player.health);
    }

    killMeteor(k, meteor);
    player.scraps += 1;

    if (player.health <= 0) {
      k.go("gameover");
    }
  });
}

export function MeteorMeteorCollision(k, player) {
  k.onCollideUpdate("meteor", "meteor", (meteor, meteor2) => {
    if (meteor.state === "dead" && player.chainExplosion) {
      killMeteor(k, meteor);
      killMeteor(k, meteor2);
      player.scraps += meteor.scrapValue;
      player.scraps += meteor2.scrapValue;
    }
  });
}

export function ShieldMeteorCollision(k, player) {
  k.onCollide("shield", "meteor", (shield, meteor) => {
    killMeteor(k, meteor);
    player.scraps += meteor.scrapValue;
    k.debug.log("bateu ");
  });
}

export function MissileMeteorCollision(k, player) {
  k.onCollide("missile", "meteor", (missile, meteor) => {
    killMeteor(k, meteor);
    player.scraps += meteor.scrapValue;
    k.destroy(missile);
  });
}

export function SawMeteorCollision(k, player) {
  k.onCollide("saw", "meteor", (saw, meteor) => {
    saw.enterState("hit");
    killMeteor(k, meteor);
    player.scraps += meteor.scrapValue;
  });
}

export function ShieldBulletCollision(k, player) {
  if (player.killingShield) {
    k.onCollide("shield", "bullet", (shield, bullet) => {
      upgradeBulletKill(k, bullet);
    });
  }
}
