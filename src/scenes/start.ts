import { Scene } from "phaser";
import { switchLevel } from "../classes/utils";
// import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

export class StartScene extends Scene {
  // rexUI!: RexUIPlugin;
  constructor() {
    super("start-scene");
  }

  preload(): void {
    this.load.baseURL = "assets/";
    this.load.animation("dude", "spriteSheet/spritesheet_anim.json");
    // 初始化雪碧图
    this.load.atlas(
      "sprite",
      "spriteSheet/spritesheet.png",
      "spriteSheet/spritesheet_atlas.json"
    );

    this.load.image("grass", "sprite/Grass_04.png");

    this.load.atlas(
      "spritesheet",
      "spriteSheet/spritesheet.png",
      "spriteSheet/spritesheet_atlas.json"
    );
    // 初始化地图

    this.load.image("mapSprite", "map/sprite.png");
    if (!this.game.device.os.desktop) {
      this.load.tilemapTiledJSON("map1", "map/m-level1.json");
      this.load.tilemapTiledJSON("map2", "map/m-level2.json");
      this.load.tilemapTiledJSON("map3", "map/m-level3.json");
    } else {
      this.load.tilemapTiledJSON("map1", "map/d-level1.json");
      this.load.tilemapTiledJSON("map2", "map/d-level2.json");
      this.load.tilemapTiledJSON("map3", "map/d-level3.json");
    }

    this.load.audio("bgMusic", "sound/Wind.mp3");
    this.load.audio("ding", "sound/ding.mp3");
    this.load.audio("go", "sound/go.wav");
    this.load.audio("running", "sound/running.mp3");
    this.load.audio("pick", "sound/pick.mp3");
    this.load.audio("fail", "sound/Sad.mp3");
    this.load.audio("win", "sound/winner.mp3");

    const percentText = this.make
      .text({
        x: (this.game.scale.width as number) / 2,
        y: (this.game.scale.height as number) / 2,
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
    const width = this.scale.width as number;
    const height = this.scale.height as number;

    this.add
      .tileSprite(0, 0, width, height, "grass")
      .setAlpha(0.2)
      .setOrigin(0, 0);
    switchLevel(this, 1);
  }
}
