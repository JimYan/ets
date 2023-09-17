import * as Phaser from "phaser";
import { Dude } from "./dude";
import { createPoisonAnims } from "../anims/anims";
// 实现毒气喷发特效
export const createPoisonAnimiTimer = (
  scene: Phaser.Scene,
  pointerLayer: Phaser.Tilemaps.ObjectLayer
) => {
  return scene.time.addEvent({
    delay: 2000, // 延迟1秒执行
    repeat: -1, // 重复3次，总共3秒倒计时
    callback: () => {
      pointerLayer.objects.map((obj) => {
        if (obj.name === "grass") {
          const img = scene.add
            .sprite(obj.x as number, obj.y as number, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(0.7, 0.7);
          const img2 = scene.add
            .sprite(obj.x as number, obj.y as number, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(0.7, 0.7);

          scene.tweens.add(
            createPoisonAnims(img, obj.x as number, obj.y as number)
          );
          scene.tweens.add(
            createPoisonAnims(img2, obj.x as number, obj.y as number, false)
          );
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
