// @ts-check
import kaplay from "kaplay";

export function createMeteor(k, player) {
  k.loadSprite("meteor", "/assets/meteoro(3).png", {
    sliceX: 19,
    anims: {
      move: { from: 0, to: 0 },
      hit: { from: 1, to: 1 },
      dead: { from: 2, to: 18 },
    },
  });

  const directions = ["left", "right", "up", "down"];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  // k.debug.log(direction);

  let x = 0;
  let y = 0;

  if (direction === "left") {
    x = -50;
    y = Math.floor(Math.random() * 720);
  } else if (direction === "right") {
    x = 1280;
    y = Math.floor(Math.random() * 720);
  } else if (direction === "up") {
    x = Math.floor(Math.random() * 1280);
    y = -50;
  } else if (direction === "down") {
    x = Math.floor(Math.random() * 1280);
    y = 720;
  }

  const firstNum = Math.floor(Math.random() * 10) + 1;
  const secondNum = Math.floor(Math.random() * 10) + 1;
  const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
  let question, result;

  switch (op) {
    case "+":
      question = `${firstNum} + ${secondNum}`;
      result = firstNum + secondNum;
      break;
    case "-":
      question = `${firstNum} - ${secondNum}`;
      result = firstNum - secondNum;
      break;
    case "*":
      question = `${firstNum} * ${secondNum}`;
      result = firstNum * secondNum;
      break;
  }

  const meteor = k.add([
    k.sprite("meteor"),
    k.pos(x, y), //1280 max width 720 height
    k.anchor("center"),
    k.scale(4.5),
    k.area({ shape: new k.Rect(k.vec2(0), 15, 15) }),
    // k.area({ shape: new k.Rect(k.vec2(0, 0), 1050, 1050) }),
    k.rotate(),
    // k.body(),
    "meteor",
    k.state("move", ["move", "dead", "hit"]),
    {
      scrapValue: 1,
      health: 20,
      speed: 50,
      firstNumOp: firstNum,
      secondNumOp: secondNum,
      operation: op,
    },
  ]);

  const angle = meteor.pos.angle(player.pos);
  meteor.angle = angle + 90;

  // gira levemente meteoro
  meteor.onStateUpdate("move", async () => {
    if (!player.exists()) return;
    const dir = player.pos.sub(meteor.pos).unit();
    meteor.move(dir.scale(meteor.speed));
    meteor.onUpdate(() => {
      meteor.angle += 0.03 * k.dt();
    });
  });

  meteor.onStateEnter("hit", async () => {
    meteor.play("hit");
    await k.wait(0.5);
    meteor.play("move");
  });

  meteor.onStateEnter("dead", async () => {
    meteor.play("dead");
    await k.wait(0.8);
    k.destroy(meteor);
  });

  meteor.onStateEnter("move", async () => {
    await k.wait(2);
    meteor.enterState("move");
  });

  meteor.add([
    k.text(meteor.firstNumOp + meteor.operation + meteor.secondNumOp, {
      font: "Silkscreen",
    }),
    k.scale(0.4),
    k.color(k.Color.fromHex("#F9ECE7")),
    k.pos(-15, -7),
  ]);
  meteor.enterState("move");
}
