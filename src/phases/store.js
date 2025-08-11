// @ts-check
import kaplay from "kaplay";
import { startPhase2 } from "./phase2";

export function createStore(k, player) {
  function createCard(upgrade, x, onClick) {
    const btn = k.add([
      k.rect(150, 300),
      k.color(k.Color.fromHex("#222222")),
      k.outline(4, k.Color.fromHex("#FFD700")),
      k.pos(x, k.center().y),
      k.anchor("center"),
      k.area(),
      { hovering: false },
    ]);

    const txt = btn.add([
      k.text(upgrade.nome, {
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

  k.scene("store", () => {
    k.loadSprite("bgStore", "/assets/storeBG.jpg");
    const bg1 = k.add([
      k.sprite("bgStore"),
      k.pos(0, 0),
      k.scale(k.width() / 1280, k.height() / 720),
      "bgStore",
    ]);

    k.add([
      k.text("MECÂNICA", {
        font: "Silkscreen",
        size: 48,
      }),
      k.pos(k.center().x, 50),
      k.anchor("center"),
    ]);

    // botão para continuar para outra fase
    const btn2 = k.add([
      k.rect(150, 100),
      k.color(k.Color.fromHex("#222222")),
      k.outline(4, k.Color.fromHex("#FFD700")),
      k.pos(600, 600),
      k.anchor("center"),
      k.area(),
      { hovering: false },
    ]);
    btn2.onUpdate(() => {
      if (btn2.isHovering()) {
        if (!btn2.hovering) {
          btn2.color = k.Color.fromHex("#444444");

          btn2.hovering = true;
        }
      } else {
        if (btn2.hovering) {
          btn2.color = k.Color.fromHex("#222222");

          btn2.hovering = false;
        }
      }
    });

    btn2.onClick(() => {
      startPhase2(k, player);
    });

    const upgrades = [
      {
        nome: "piercingBullet",
        preco: 20,
        descricao: "Balas perfuram meteoros",
      },
      {
        nome: "chainExplosion",
        preco: 25,
        descricao: "Meteoros destroem outros na proximidade ao explodirem",
      },
      {
        nome: "shield",
        preco: 20,
        descricao: "Escudo contra meteoros",
      },
    ];

    let numbers = [0, 1, 2];

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let upgrade1 = numbers[0];
    let upgrade2 = numbers[1];
    let upgrade3 = numbers[2];

    createCard(upgrades[upgrade1], 300, () => {
      player[upgrades[upgrade1].nome] = true;
    });
    createCard(upgrades[upgrade2], 600, () => {
      player[upgrades[upgrade2].nome] = true;
    });
    createCard(upgrades[upgrade3], 900, () => {
      player[upgrades[upgrade3].nome] = true;
    });
  });
}
