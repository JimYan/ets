import * as Phaser from "phaser";
import { tLevel } from "../config/constant";
import CountdownText from "./CountdownText";
export const switchLevel = (scene: Phaser.Scene, level: tLevel) => {
  const self = scene;
  const width = scene.game.scale.width;
  const height = scene.game.scale.height;
  const countdownText = new CountdownText(
    scene,
    width / 2,
    height / 2,
    ["3", "2", "1", "Go!"],
    () => {
      scene.scene.start("game-scene", {
        level: level,
      });

      scene.scene.start("ui-scene", {
        level: level,
      });

      scene.scene.start("audio-scene", {
        level: level,
      });
    }
  );
  scene.add.existing(countdownText);
};
