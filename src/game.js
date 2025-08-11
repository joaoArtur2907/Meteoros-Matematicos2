// @ts-check
import kaplay from "kaplay";
import { createPlayer } from "./player";
import { createMeteor } from "./meteor";
import { createPower } from "./power";
import { startPhase1 } from "./phases/phase1";
import { startPhase2 } from "./phases/phase2";

function handleBackground(k) {}

export function startGame(k, fase) {
  k.loadSound("meteorHit2", "/assets/meteoro_morte_explosao.wav");
  k.loadFont("Silkscreen", "/assets/Silkscreen-Regular.ttf");
  k.scene("game", () => {
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

    let player = createPlayer(k);
    if (fase === 1) {
      startPhase1(k, player);
    }
    if (fase === 2) {
      startPhase2(k, player);
    }
  });

  k.scene("gameover", () => {
    k.add([k.text("Game Over!"), k.pos(k.center()), k.anchor("center")]);
    // Botão Iniciar
    const returnButton = k.add([
      k.text("Voltar ao menu", { size: 32 }),
      k.pos(k.center().x, 250),
      k.anchor("center"),
      k.area(),
      k.color(k.Color.fromHex("#ffffff")),
      "start-button",
    ]);

    returnButton.onClick(() => {
      k.go("menu");
    });
    returnButton.onUpdate(() => {
      returnButton.color = returnButton.isHovering()
        ? k.Color.fromHex("#ff0000")
        : k.Color.fromHex("#ffffff");
    });
  });

  k.go("game");
}
