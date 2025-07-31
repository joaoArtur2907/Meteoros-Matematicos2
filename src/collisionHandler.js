// @ts-check
import kaplay from "kaplay";

import { createPower } from "./power";

export function bulletMeteorCollision(k, player) {
  k.onCollide("meteor", "bullet", async (meteor, bullet) => {
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

    // problem here maybe?
    if (bullet.value == result || bullet.instaKill) {
      meteor.enterState("dead");
      await k.wait(1);
      k.destroy(meteor);
      if (player.piercingBullet) {
        bullet.instaKill = true;
        bullet.color = k.Color.fromHex("#D21A1E");
        k.debug.log(bullet.color);
      } else {
        k.destroy(bullet);
      }
    } else {
      k.debug.log(bullet.color);

      meteor.enterState("hit");
      k.destroy(bullet);
    }
  });
}

export function playerMeteorCollision(k, player, options = {}) {
  let currentHealth = player.health;

  k.onCollide("player", "meteor", (player, meteor) => {
    currentHealth -= 1;

    k.shake(50);
    player.enterState("hit");

    k.get("power").forEach(k.destroy);
    createPower(k, 0, currentHealth);
    k.destroy(meteor);

    if (currentHealth <= 0) {
      k.go("gameover");
    }
  });
}
