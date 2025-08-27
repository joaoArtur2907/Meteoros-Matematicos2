// @ts-check
import kaplay from "kaplay";

export function createSaw(k) {
  k.loadSprite("saw", "/assets/saw(1).png", {
    sliceX: 6,
    anims: {
      idle: { from: 0, to: 4, speed: 20, loop: true },
      hit: { from: 5, to: 5 },
    },
  });

  const saw = k.add([
    {
      add() {
        this.onObjectsSpotted((objects) => {
          const meteorSeen = objects.some((o) => o.is("meteor"));
          if (meteorSeen) {
            saw.action = "persuit";
          }
        });
      },
    },
    k.sprite("saw"),
    k.pos(600, 600),
    k.scale(2),
    k.area(),
    k.anchor("center"),
    k.rotate(),
    "saw",
    k.state("idle", ["idle", "hit"]),
    {
      speed: 70,
    },
    k.sentry(
      { include: "meteor" },
      {
        lineOfSight: true,
        raycastExclude: ["saw"],
      }
    ),
  ]);

  saw.onStateUpdate("idle", async () => {
    saw.onUpdate(() => {
      saw.angle += 0.1 * k.dt();
    });
  });

  k.onUpdate("saw", (saw) => {
    const meteors = k.get("meteor");

    if (meteors.length === 0) return;

    let nearestMeteor = meteors[0];
    let minDist = saw.pos.dist(nearestMeteor.pos);

    for (let m of meteors) {
      const dist = saw.pos.dist(m.pos);
      if (dist < minDist) {
        minDist = dist;
        nearestMeteor = m;
      }
    }

    saw.moveTo(nearestMeteor.pos, saw.speed);
  });

  saw.onStateEnter("idle", async () => {
    await k.wait(0.25);
    saw.enterState("idle");
    saw.play("idle");
  });

  saw.onStateEnter("hit", async () => {
    k.debug.log("entered hig");
    saw.play("hit");
    await k.wait(2.0);
    saw.play("idle");
  });
  return saw;
}
