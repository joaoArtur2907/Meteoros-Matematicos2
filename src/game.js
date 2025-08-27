// @ts-check
import kaplay from "kaplay";

export function startGame(k, fase) {
  k.go("phase" + fase);
}
export function createGameScenes(k) {
  k.scene("gameover", () => {
    k.add([k.text("Game Over!"), k.pos(k.center()), k.anchor("center")]);

    const returnButton = k.add([
      k.text("Voltar ao menu", { size: 32 }),
      k.pos(k.center().x, 250),
      k.anchor("center"),
      k.area(),
      k.color(k.Color.fromHex("#FFFFFF")),
      "start-button",
    ]);

    returnButton.onClick(() => {
      k.go("menu");
    });

    returnButton.onUpdate(() => {
      returnButton.color = returnButton.isHovering()
        ? k.Color.fromHex("#ff0000")
        : k.Color.fromHex("#FFFFFF");
    });
  });
}
