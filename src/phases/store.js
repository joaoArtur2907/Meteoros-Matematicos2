// @ts-check
import kaplay from "kaplay";
import { scrapCounter } from "./phaseUtils";

export function createStore(k) {
  k.scene("store", ({ playerData, nextPhaseNumber }) => {
    k.loadSprite("bgStore", "/assets/storeBG.jpg");
    k.loadSprite("shieldIcon", "/assets/shieldSprite (2).png");
    k.loadSprite("chainIcon", "/assets/chainExplosionSprite.png");
    k.loadSprite("piercingIcon", "/assets/piercingBullet.png");
    k.loadSprite("missile", "/assets/missile.png");
    k.loadSprite("dash", "/assets/superDash.png");
    k.loadSprite("killShield", "/assets/killingShield.png");
    k.loadSprite("power", "/assets/power - Copia.png");

    k.add([
      k.sprite("bgStore"),
      k.pos(0, 0),
      k.scale(k.width() / 1280, k.height() / 720),
    ]);

    scrapCounter(k, playerData);

    k.add([
      k.text("MECÂNICA", { font: "Silkscreen", size: 48, align: "center" }),
      k.pos(k.center().x, 60),
      k.anchor("center"),
      k.color(k.Color.fromHex("#FFD700")),
    ]);

    const btnContinuar = k.add([
      k.rect(250, 80, { radius: 4 }),
      k.pos(k.center().x, 640),
      k.anchor("center"),
      k.outline(4, k.Color.fromHex("#FFD700")),
      k.color(k.Color.fromHex("#222222")),
      k.area(),
    ]);
    const btnContinuarTxt = btnContinuar.add([
      k.text("CONTINUAR", { font: "Silkscreen", size: 30, align: "center" }),
      k.anchor("center"),
    ]);

    btnContinuar.onClick(() => {
      k.go("phase" + nextPhaseNumber, {
        playerState: playerData,
      });
    });

    btnContinuar.onUpdate(() => {
      if (btnContinuar.isHovering()) {
        btnContinuar.color = k.Color.fromHex("#444444");
        btnContinuarTxt.color = k.Color.fromHex("#00FF00");
      } else {
        btnContinuar.color = k.Color.fromHex("#222222");
        btnContinuarTxt.color = k.Color.fromHex("#FFFFFF");
      }
    });

    const upgrades = [
      {
        id: "piercingBullet",
        nome: "BALA PERFURANTE",
        descricao: "Projéteis atravessam múltiplos meteoros.",
        icon: "piercingIcon",
        price: 5,
      },
      {
        id: "chainExplosion",
        nome: "REAÇÃO EM CADEIA",
        descricao:
          "Meteoros destruídos explodem e podem danificar outros próximos.",
        icon: "chainIcon",
        price: 5,
      },
      {
        id: "shield",
        nome: "ESCUDO ORBITAL",
        descricao: "Cria um escudo que destrói meteoros ao contato.",
        icon: "shieldIcon",
        price: 5,
      },
      {
        id: "missile",
        nome: "Misseis teleguiados",
        descricao: "Atira misseis teleguiados constantemente",
        icon: "missile",
        price: 10,
      },
      {
        id: "superDash",
        nome: "Super Dash",
        descricao:
          "A cada poucos segundos, realiza um dash que destroi meteoros",
        icon: "dash",
        price: 10,
      },
    ];

    let numbers = [0, 1, 2, 3, 4];

    if (playerData.shield) {
      upgrades.push({
        id: "killingShield",
        nome: "Killing Shield",
        descricao: "Tiros que atravessarem o escudo explodirão meteoros",
        icon: "killShield",
        price: 1,
      });
      numbers.push(5);
    }

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    let upgrade1 = upgrades[numbers[0]];
    let upgrade2 = upgrades[numbers[1]];
    let upgrade3 = upgrades[numbers[2]];

    function createCard(upgrade, x) {
      const card = k.add([
        k.rect(220, 385, { radius: 8 }),
        k.color(k.Color.fromHex("#1a1a1a")),
        k.outline(4, k.Color.fromHex("#555555")),
        k.pos(x, k.center().y),
        k.anchor("center"),
        k.area(),
        k.scale(1),
        {
          purchased: false,
          isHoveringState: false,
        },
      ]);

      card.add([
        k.sprite(upgrade.icon),
        k.pos(0, -120),
        k.anchor("center"),
        k.scale(0.3),
      ]);

      card.add([
        k.text(upgrade.nome, {
          font: "Silkscreen",
          size: 24,
          width: 190,
          align: "center",
        }),
        k.pos(0, 20),
        k.anchor("center"),
        k.color(k.Color.fromHex("#FFD700")),
      ]);

      card.add([
        k.text(upgrade.descricao, {
          font: "Silkscreen",
          size: 16,
          width: 190,
          lineSpacing: 4,
        }),
        k.pos(0, 90),
        k.anchor("center"),
        k.color(k.Color.fromHex("#cccccc")),
      ]);

      card.add([
        k.text("$" + upgrade.price, {
          font: "Silkscreen",
          size: 30,
          width: 190,
          lineSpacing: 4,
        }),
        k.pos(0, 170),
        k.anchor("center"),
        k.color(k.Color.fromHex("#cccccc")),
      ]);

      card.onClick(() => {
        if (card.purchased) return;
        if (playerData.scraps >= upgrade.price) {
          playerData[upgrade.id] = true;
          card.purchased = true;
          card.color = k.Color.fromHex("#003300");
          card.outline.color = k.Color.fromHex("#00FF00");

          playerData.scraps = playerData.scraps - upgrade.price;
        }
      });

      card.onUpdate(() => {
        if (card.isHovering()) {
          if (!card.isHoveringState) {
            card.isHoveringState = true;
            k.tween(
              card.scale,
              k.vec2(1.05),
              0.2,
              (s) => (card.scale = s),
              k.easings.easeOutElastic
            );
            if (!card.purchased) {
              card.outline.color = k.Color.fromHex("#FFD700");
            }
          }
        } else {
          if (card.isHoveringState) {
            card.isHoveringState = false;
            k.tween(
              card.scale,
              k.vec2(1),
              0.2,
              (s) => (card.scale = s),
              k.easings.easeOutElastic
            );
            if (!card.purchased) {
              card.outline.color = k.Color.fromHex("#555555");
            }
          }
        }
      });
    }

    function createLifeCard(x) {
      const card = k.add([
        k.rect(150, 200, { radius: 8 }),
        k.color(k.Color.fromHex("#1a1a1a")),
        k.outline(4, k.Color.fromHex("#555555")),
        k.pos(x, k.center().y),
        k.anchor("center"),
        k.area(),
        k.scale(1),
        {
          purchased: false,
          isHoveringState: false,
        },
      ]);

      card.add([
        k.sprite("power"),
        k.pos(0, -35),
        k.anchor("center"),
        k.scale(3),
      ]);

      card.add([
        k.text("POWER", {
          font: "Silkscreen",
          size: 23,
          width: 190,
          align: "center",
        }),
        k.pos(0, 20),
        k.anchor("center"),
        k.color(k.Color.fromHex("#FFD700")),
      ]);

      card.add([
        k.text("Recupera 1 poder", {
          font: "Silkscreen",
          size: 15,
          width: 140,
          lineSpacing: 4,
        }),
        k.pos(25, 60),
        k.anchor("center"),
        k.color(k.Color.fromHex("#cccccc")),
      ]);

      card.add([
        k.text("$1", {
          font: "Silkscreen",
          size: 25,
          width: 190,
          lineSpacing: 4,
        }),
        k.pos(120, 75),
        k.anchor("center"),
        k.color(k.Color.fromHex("#cccccc")),
      ]);

      card.onClick(() => {
        if (card.purchased) return;
        if (playerData.scraps >= 1) {
          playerData.health += 1;
          card.purchased = true;
          card.color = k.Color.fromHex("#003300");
          card.outline.color = k.Color.fromHex("#00FF00");

          playerData.scraps = playerData.scraps - 1;
        }
      });

      card.onUpdate(() => {
        if (card.isHovering()) {
          if (!card.isHoveringState) {
            card.isHoveringState = true;
            k.tween(
              card.scale,
              k.vec2(1.05),
              0.2,
              (s) => (card.scale = s),
              k.easings.easeOutElastic
            );
            if (!card.purchased) {
              card.outline.color = k.Color.fromHex("#FFD700");
            }
          }
        } else {
          if (card.isHoveringState) {
            card.isHoveringState = false;
            k.tween(
              card.scale,
              k.vec2(1),
              0.2,
              (s) => (card.scale = s),
              k.easings.easeOutElastic
            );
            if (!card.purchased) {
              card.outline.color = k.Color.fromHex("#555555");
            }
          }
        }
      });
    }

    createCard(upgrade1, 350);
    createCard(upgrade2, k.center().x);
    createCard(upgrade3, 920);
    createLifeCard(1150);
  });
}
