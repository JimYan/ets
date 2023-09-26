import * as Phaser from "phaser";
import { Dude } from "./dude";
import { createPoisonAnims } from "../anims/anims";
import { GameScene } from "../scenes/gameMain";
// 实现毒气喷发特效
export const createPoisonAnimiTimer = (
  scene: GameScene,
  pointerLayer: Phaser.Tilemaps.ObjectLayer
) => {
  return scene.time.addEvent({
    delay: 2000, // 延迟1秒执行
    repeat: -1, // 重复3次，总共3秒倒计时
    callback: () => {
      pointerLayer.objects.map((obj) => {
        if (obj.name === "grass") {
          const x = (obj.x as number) * scene.scaleX;
          const y = (obj.y as number) * scene.scaleY;
          const img = scene.add
            .sprite(x, y, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(0.7, 0.7);
          const img2 = scene.add
            .sprite(x, y as number, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(0.7, 0.7);

          scene.tweens.add(createPoisonAnims(img, x, y));
          scene.tweens.add(createPoisonAnims(img2, x, y, false));
        }
      });
    },
  });
};

// 计算dude的毒气剂量
export const ceateDudePosionTimer = (dude: Dude) => {
  return dude.scene.time.addEvent({
    delay: 1000,
    repeat: -1, // 重复3次，总共3秒倒计时
    callback: () => {
      dude.addPosion();
      //   console.log(dude.getPosion());
    },
  });
};
