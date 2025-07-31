// @ts-check
import kaplay from "kaplay";

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
    k.opacity(0.5),

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
  k.loadSprite("player", "/assets/nave3.png", {
    sliceX: 15,
    anims: {
      idle: { from: 0, to: 14, speed: 20, loop: true },
      hit: { from: 14, to: 14 },
    },
  });

  const player = k.add([
    k.sprite("player"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(2),
    k.area(),
    k.state("idle", ["idle", "hit"]),
    "player",
    {
      health: 15,
      piercingBullet: true,
    },
  ]);

  player.onStateEnter("idle", async () => {
    await k.wait(0.25);
    player.enterState("idle");
    player.play("idle");
  });

  player.onStateEnter("hit", async () => {
    player.play("hit");
    await k.wait(0.5);
    player.play("idle");
  });

  // fixes sprite angle
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

  // bullet
  let isOnCooldown = false;
  const COOLDOWN_TIME = 500;

  k.onClick(() => {
    if (isOnCooldown) return;

    let value = responseBullet.text;
    shoot(k, player, value);

    isOnCooldown = true;
    responseBullet.destroy();
    responseBullet = createInput();

    setTimeout(() => {
      isOnCooldown = false;
    }, COOLDOWN_TIME);
  });

  return player;
}
