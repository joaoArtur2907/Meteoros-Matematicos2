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
    volume: 1,
    speed: 1,
  });

  // Aguarda a animação terminar (ajuste para o tempo real da sua animação)
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

      if (player.piercingBullet) {
        upgradeBulletKill(k, bullet);
      } else {
        k.destroy(bullet);
      }
    } else {
      k.play("wrong", {
        volume: 1,
        speed: 1,
      });
      meteor.enterState("hit");
      k.destroy(bullet);
    }
  });
}

export function playerMeteorCollision(k, player) {
  let currentHealth = player.health;

  k.onCollide("player", "meteor", (player, meteor) => {
    currentHealth -= 1;

    k.shake(50);
    k.play("playerHit", {
      volume: 1,
      speed: 1,
    });
    player.enterState("hit");

    k.get("power").forEach(k.destroy);
    createPower(k, 0, currentHealth);
    k.destroy(meteor);

    if (currentHealth <= 0) {
      k.go("gameover");
    }
  });
}

export function MeteorMeteorCollision(k, player) {
  k.onCollideUpdate("meteor", "meteor", (meteor, meteor2) => {
    if (meteor.state === "dead" && player.chainExplosion) {
      killMeteor(k, meteor);
      killMeteor(k, meteor2);
    }
  });
}

export function ShieldMeteorCollision(k, player) {
  k.onCollide("shield", "meteor", (shield, meteor) => {
    killMeteor(k, meteor);
    k.debug.log("bateu ");
  });
}

export function ShieldBulletCollision(k, player) {
  if (player.killingShield) {
    k.onCollide("shield", "bullet", (shield, bullet) => {
      upgradeBulletKill(k, bullet);
    });
  }
}
