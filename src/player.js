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
    "bullet",
    {
      value: value,
    },
  ]);
  // k.debug.log(bullet.value);
}

function mousePositionAngle(k, player) {
  const mouse = k.mousePos();
  const angle = player.pos.angle(k.mousePos()) + 180;
  return angle;
}

export function createPlayer(k) {
  k.loadSprite("player", "/assets/nave.png", {
    sliceX: 1,
  });

  const player = k.add([
    k.sprite("player"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(64 / 640),
    k.area(),
    "player",
    {
      health: 3,
    },
  ]);

  k.onUpdate(() => {
    player.angle = mousePositionAngle(k, player);
  });

  let responseBullet = createInput();

  function createInput() {
    return k.add([
      k.text(""),
      "responseBullet",
      k.textInput(true, 5),
      k.anchor("center"),
      k.scale(1),
      k.pos(k.center().x, k.center().y + 50),
    ]);
  }

  // bullet
  let isOnCooldown = false;
  const COOLDOWN_TIME = 500; // 1 seg
  k.onClick(() => {
    if (isOnCooldown) {
      // k.debug.log("Recharging");
      return;
    }

    let value = responseBullet.text;

    shoot(k, player, value);
    isOnCooldown = true;

    responseBullet.destroy();
    responseBullet = createInput();

    setTimeout(() => {
      isOnCooldown = false;
      // k.debug.log("Recharged");
    }, COOLDOWN_TIME);
  });

  return player;
}
