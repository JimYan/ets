import * as Phaser from "phaser";
import { Math } from "phaser";
import { Dude } from "./dude";
import { createPoisonAnims } from "../anims/anims";
import { GameScene } from "../scenes/gameMain";
import { getObjXY } from "./utils";

// 实现毒气喷发特效

export const createPoisonAnimiTimer = (
  scene: GameScene,
  pointerLayer: Phaser.Tilemaps.ObjectLayer,
  map: Phaser.Tilemaps.Tilemap
) => {
  return scene.time.addEvent({
    delay: 2000, // 延迟1秒执行
    repeat: -1, // 重复3次，总共3秒倒计时
    callback: () => {
      pointerLayer.objects.map((obj) => {
        const dx = map.tileToWorldX(0) as number;
        const dy = map.tileToWorldY(0) as number;
        if (obj.name === "grass") {
          // console.log(map.tileToWorldX(getTile(obj.x as number)));
          const [x, y] = getObjXY(obj, map);
          // const y = (obj.y as number) * scene.scaleY + dy;
          // const x = map.tileToWorldX(getTile(obj.x as number)) as number;
          // const y = map.tileToWorldY(getTile(obj.y as number)) as number;
          const img = scene.add
            .sprite(x, y, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(scene.scaleX * 0.7, scene.scaleY * 0.7);
          const img2 = scene.add
            .sprite(x, y as number, "sprite", "co2")
            .setAlpha(0.5)
            .setScale(scene.scaleX * 0.7, scene.scaleY * 0.7);

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
