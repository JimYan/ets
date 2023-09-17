import { Scene } from "phaser";
import { switchLevel } from "../classes/utils";
export class StartScene extends Scene {
  constructor() {
    super("start-scene");
  }

  preload(): void {
    this.load.baseURL = "assets/";
    // 初始化雪碧图
    this.load.atlas(
      "sprite",
      "spriteSheet/spritesheet.png",
      "spriteSheet/spritesheet_atlas.json"
    );
    // 初始化地图
    this.load.image("mapSprite", "map/sprite.png");
    this.load.tilemapTiledJSON("map1", "map/level1.json");
    this.load.tilemapTiledJSON("map2", "map/level2.json");
    this.load.tilemapTiledJSON("map3", "map/level3.json");

    const percentText = this.make
      .text({
        x: (this.game.config.width as number) / 2,
        y: (this.game.config.height as number) / 2 - 5,
        text: "0%",
        style: {
          font: "18px monospace",
        },
      })
      .setOrigin(0.5, 0.5);

    this.load.on("progress", function (value: number) {
      percentText.setText(parseInt((value * 100) as unknown as string) + "%");
    });

    this.load.on("complete", function () {
      percentText.destroy();
    });
  }

  create(): void {
    switchLevel(this, 1);
  }
}
