import { GameObjects, Scene } from "phaser";

export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string, style = {}) {
    super(scene, x, y, text, {
      fontSize: "calc(100vw / 50)",
      color: "#fff",
      fontFamily: "Times New Roman, Times, serif",
      // stroke: "#000",
      // strokeThickness: 4,
      ...style,
    });

    // this.setOrigin(0, 0);

    // scene.add.existing(this);
  }
}
