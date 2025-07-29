export function createPower(k, posX, lives) {
  k.loadSprite("power", "/assets/power.png", {
    sliceX: 3,
    anims: {
      idle: { from: 0, to: 2, speed: 3, loop: true },
    },
  });

  for (let i = 0; i < lives; i++) {
    const power = k.add([
      k.sprite("power"),
      k.pos(posX, 0),
      k.scale(2.5),
      k.state("idle", ["idle"]),
      "power",
    ]);
    posX += 60;
    power.play("idle");
  }
}
