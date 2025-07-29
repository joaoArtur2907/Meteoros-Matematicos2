// @ts-check
import kaplay from "kaplay";
import { createPlayer } from "./player";
import { createMeteor } from "./meteor";
import { createPower } from "./power";

export function startGame(k) {
  k.scene("game", () => {
    k.loadSprite("bg", "/assets/bg3.png");
    k.add([
      k.sprite("bg"),
      k.pos(0, 0),
      k.scale(k.width() / 1280, k.height() / 720),
      k.fixed(),
    ]);

    let player = createPlayer(k);
    // cria meteoros aleatoriamente a cada 5 segundos
    k.loop(5, () => {
      createMeteor(k, player);
    });

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

      if (bullet.value == result) {
        meteor.enterState("dead");
        await k.wait(1);
        k.destroy(meteor);
      } else {
        k.debug.log("errou");
        meteor.enterState("hit");
      }
      k.destroy(bullet);
    });

    createPower(k, 0, player.health);

    let currentHealth = player.health;
    k.onCollide("player", "meteor", (player, meteor) => {
      currentHealth -= 1;
      counterUI.text = currentHealth;
      k.get("power").forEach(k.destroy); // remove vidas antigas
      createPower(k, 0, currentHealth);
      k.destroy(meteor);

      if (currentHealth <= 0) {
        k.go("gameover");
      }
    });

    const counterUI = k.add([k.text(player.health)]);

    // function UpdateLives(currentHealth) {
    //   createPower(k, 0, player.health);
    // }
  });

  k.scene("gameover", () => {
    k.add([k.text("Game Over!"), k.pos(k.center()), k.anchor("center")]);
  });
}
