// @ts-check
import kaplay from "kaplay";
import { killMeteor } from "./collisionHandler";

function shoot(k, player, value) {
  let BULLET_SPEED = 400;
  const angle = mousePositionAngle(k, player);
  const bullet = k.add([
    k.pos(player.pos),
    k.move(angle, BULLET_SPEED),
    k.rect(20, 10),
    k.rotate(angle),
    k.area(),
    k.offscreen({ destroy: true }),
    k.anchor("center"),
    k.color(k.Color.fromHex("#FFFFFF")),
    "bullet",
    {
      value: value,
      instaKill: false,
    },
  ]);

  if (bullet.instaKill) {
    bullet.use(k.color(k.Color.fromHex("#D21A1E")));
  }
}

function mousePositionAngle(k, player) {
  const mouse = k.mousePos();
  const angle = player.pos.angle(mouse) + 180;
  return angle;
}

export function createPlayer(k) {
  k.loadSprite("player", "/assets/nave(1).png", {
    sliceX: 17,
    anims: {
      idle: { from: 0, to: 13, speed: 20, loop: true },
      hit: { from: 14, to: 14 },
      superDash: { from: 15, to: 16, speed: 20, loop: true },
    },
  });

  const player = k.add([
    k.sprite("player"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(2),
    k.area({ shape: new k.Rect(k.vec2(0), 15, 15) }),
    k.state("idle", ["idle", "hit", "superDash"]),
    "player",
    {
      scraps: 10,
      health: 2, // vida
      piercingBullet: false, // balas atravessam alvos
      chainExplosion: false, // meteoros explodem outros perto
      shield: false, // escudo que orbita player e destroi meteoros
      killingShield: false, // balas que atravessam o escudo viram mortais
      missile: true, // misseis teleguiados a cada poucos segundos
      speed: 5, // velocidade de movimento da nave
      superDash: true, // dash que atravessa meteoros
      superDashActive: false,
      superDashCooldown: 10000,
    },
  ]);

  player.onStateEnter("idle", async () => {
    player.play("idle");
  });

  player.onStateEnter("superDash", async () => {
    player.play("superDash");
  });

  player.onStateEnter("hit", async () => {
    player.play("hit");
    await k.wait(1.5);
    player.play("idle");
  });

  // arruma angulo do sprite
  k.onUpdate(() => {
    player.angle = mousePositionAngle(k, player) + 90;
  });

  let responseBullet = createInput();

  function createInput() {
    return k.add([
      k.text("", {
        font: "Silkscreen",
      }),
      "responseBullet",
      k.textInput(true, 5),
      k.anchor("center"),
      k.scale(1),
      k.pos(k.center().x, k.center().y + 50),
    ]);
  }

  k.loadSound("pew", "/assets/pew_shot.wav");
  // tiro
  let isOnCooldown = false;
  let isOnCooldownDash = false;
  const COOLDOWN_TIME = 500;

  k.onClick((btn) => {
    let curTween = null;
    if (btn == "left") {
      if (isOnCooldown) return;

      let value = responseBullet.text;
      shoot(k, player, value);
      k.play("pew", {
        volume: 0.2,
        speed: 1,
      });
      isOnCooldown = true;
      responseBullet.destroy();
      responseBullet = createInput();

      setTimeout(() => {
        isOnCooldown = false;
      }, COOLDOWN_TIME);
    } else if (btn == "right") {
      if (curTween) k.curTween.cancel();

      if (player.superDash) {
        player.play("idle");
        if (!isOnCooldownDash) {
          player.superDashActive = true;
          player.play("superDash");
          isOnCooldownDash = true;
          setTimeout(() => {
            isOnCooldownDash = false;
          }, player.superDashCooldown);
        }
      }

      let mousePos = k.mousePos();
      curTween = k.tween(
        player.pos,
        mousePos,
        player.speed,
        (val) => (player.pos = val),
        k.easings.easeOutCubic
      );

      curTween.onEnd(() => {
        player.superDashActive = false;
        player.enterState("idle");
      });
    }
  });

  function shield() {
    const center = k.add([k.pos(k.center()), k.anchor(k.vec2(0, 0))]);
    const barrier = center.add([k.rotate(0)]);
    // velocidade de rotacao do escudo
    barrier.onUpdate(() => {
      barrier.rotateBy(10 * k.dt());
    });

    const shield = barrier.add([
      k.rect(50, 10),
      k.pos(180, 0),
      k.anchor(k.vec2(0, 0)),
      k.rotate(0),
      k.area(),
      k.color(k.Color.fromHex("#0EDED7")),
      k.body(),
      "shield",
    ]);
    shield.onUpdate(() => {
      shield.rotateBy(-90 * k.dt());
      shield.angle = -90;
    });
  }

  function missile() {
    let missileCooldown = 5;
    let lastShot = 0;
    function missile(posX, posY) {
      const missile = k.add([
        {
          add() {
            this.onObjectsSpotted((objects) => {
              const meteorSeen = objects.some((o) => o.is("meteor"));
              if (meteorSeen) {
                missile.action = "persuit";
              }
            });
          },
        },
        k.rect(5, 20),
        k.pos(posX, posY),
        k.anchor("center"),
        k.color(k.Color.fromHex("#DE690E")),
        k.area(),
        k.rotate(0),
        {
          cooldown: missileCooldown,
          speed: 70,
        },
        "missile",
        k.sentry(
          { include: "meteor" },
          {
            lineOfSight: true,
            raycastExclude: ["missile"],
          }
        ),
      ]);
      return missile;
    }

    k.onUpdate("missile", (missile) => {
      const meteors = k.get("meteor");

      if (meteors.length === 0) return;

      let nearestMeteor = meteors[0];
      let minDist = missile.pos.dist(nearestMeteor.pos);

      for (let m of meteors) {
        const dist = missile.pos.dist(m.pos);
        if (dist < minDist) {
          minDist = dist;
          nearestMeteor = m;
        }
      }

      const dir = nearestMeteor.pos.sub(missile.pos);
      missile.angle = dir.angle() + 90;

      missile.moveTo(nearestMeteor.pos, missile.speed);
    });

    k.onUpdate(() => {
      if (k.time() - lastShot >= missileCooldown) {
        missile(player.pos.x, player.pos.y);
        lastShot = k.time();
      }
    });
  }

  player.activateShield = shield;
  player.activateMissile = missile;

  return player;
}
