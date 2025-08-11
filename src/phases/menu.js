// @ts-check
import kaplay from "kaplay";
import { createMeteor } from "../meteor";
import { createPower } from "../power";
import { startGame } from "../game";

export function createMenu(k) {
  k.scene("menu", () => {
    k.loadFont("Silkscreen", "/assets/Silkscreen-Regular.ttf");

    k.loadSprite("bgMenu", "/assets/backgroundMenu.jpg");
    k.add([
      k.sprite("bgMenu"),
      k.pos(0, 0),
      k.scale(k.width() / 1280, k.height() / 720),
      "bgMenu",
    ]);

    k.add([
      k.text("METEOROS MATEMÁTICOS 2", {
        font: "Silkscreen",
        size: 48,
      }),
      k.pos(k.center().x, 80),
      k.anchor("center"),
      k.color(k.Color.fromHex("#FFD700")),
    ]);

    function createButton(label, y, onClick) {
      const btn = k.add([
        k.rect(220, 60),
        k.color(k.Color.fromHex("#222222")),
        k.outline(4, k.Color.fromHex("#FFD700")),
        k.pos(k.center().x, y),
        k.anchor("center"),
        k.area(),
        { hovering: false },
      ]);

      const txt = btn.add([
        k.text(label, {
          font: "Silkscreen",
          size: 28,
        }),
        k.color(k.Color.fromHex("#FFFFFF")),
        k.anchor("center"),
        k.pos(btn.width / 200, btn.height / 200),
      ]);

      btn.onClick(() => {
        onClick();
      });

      btn.onUpdate(() => {
        if (btn.isHovering()) {
          if (!btn.hovering) {
            btn.color = k.Color.fromHex("#444444");
            txt.color = k.Color.fromHex("#00FF00");
            btn.hovering = true;
          }
        } else {
          if (btn.hovering) {
            btn.color = k.Color.fromHex("#222222");
            txt.color = k.Color.fromHex("#FFFFFF");
            btn.hovering = false;
          }
        }
      });

      return btn;
    }

    createButton("INICIAR", 220, () => {
      startGame(k, 1);
    });
    createButton("FASES", 320, () => {
      k.go("faseSelector");
    });

    createButton("SAIR", 420, () => {
      window.close();
    });

    k.add([
      k.text("© 2025 - Meteoros Matemáticos", {
        font: "Silkscreen",
        size: 16,
      }),
      k.pos(k.center().x, k.height() - 40),
      k.anchor("center"),
      k.color(k.Color.fromHex("#AAAAAA")),
    ]);
  });
}
