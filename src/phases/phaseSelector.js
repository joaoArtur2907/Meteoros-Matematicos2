// @ts-check
import kaplay from "kaplay";
import { startGame } from "../game";

export function createPhaseSelector(k) {
  k.scene("faseSelector", () => {
    k.loadFont("Silkscreen", "/assets/Silkscreen-Regular.ttf");
    k.loadSprite("bgMenu", "/assets/backgroundMenu.jpg");
    k.add([
      k.sprite("bgMenu"),
      k.pos(0, 0),
      k.scale(k.width() / 1280, k.height() / 720),
      "bgMenu",
    ]);

    k.add([
      k.text("SELECIONE A FASE", {
        font: "Silkscreen",
        size: 36,
      }),
      k.pos(k.center().x, 60),
      k.anchor("center"),
      k.color(k.Color.fromHex("#FFD700")),
    ]);

    function createButton(label, x, y, onClick) {
      const btn = k.add([
        k.rect(200, 60),
        k.color(k.Color.fromHex("#222222")),
        k.outline(4, k.Color.fromHex("#FFD700")),
        k.pos(x, y),
        k.anchor("center"),
        k.area(),
        { hovering: false },
      ]);

      const txt = btn.add([
        k.text(label, {
          font: "Silkscreen",
          size: 24,
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

    createButton("FASE 1", 300, 200, () => {
      startGame(k, 1);
    });
    createButton("FASE 2", 600, 200, () => {
      startGame(k, 2);
    });
    createButton("LOJA", 900, 200, () => {
      k.go("store");
    });

    createButton("VOLTAR", k.center().x, k.height() - 100, () => {
      k.go("menu");
    });
  });
}
