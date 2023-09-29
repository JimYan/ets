import { Scene } from "phaser";
import CountdownText from "../classes/CountdownText";
import { switchLevel } from "../classes/utils";
import { dudeStatus, gameStatus, tLevel } from "../config/constant";
import { Text } from "../classes/text";
export class EndScene extends Scene {
  private width!: number;
  private height!: number;
  constructor() {
    super("end-scene");
  }

  preload(): void {}

  create(props: {
    status: gameStatus;
    level?: tLevel;
    dudeStatus?: dudeStatus;
  }): void {
    this.width = this.game.scale.width;
    this.height = this.game.scale.height;
    switch (props.status) {
      case gameStatus.fail:
        this.fail(props.level || 1, props.dudeStatus);
        break;
      case gameStatus.victory:
        this.victory();
        break;
      case gameStatus.next:
        this.next(props.level as tLevel);
        break;
    }
  }
  private fail(level: tLevel, DeduStatus?: dudeStatus) {
    let tips = "";
    switch (DeduStatus) {
      case dudeStatus.posion:
        tips = "精灵被毒死，游戏结束";
        break;
      case dudeStatus.sparks:
        tips = "精灵被火苗烫伤，游戏结束";
        break;
      default:
        tips = "游戏结束";
        break;
    }
    // const startButton = this.add
    //   .text(this.width / 2, this.height / 2, `${tips}! 点我重玩一次`)
    //   .setInteractive()
    //   .setOrigin(0.5, 0.5);
    const startButton = new Text(
      this,
      this.width / 2,
      this.height / 2,
      `${tips}! 点我重玩一次`
    );
    startButton.setInteractive().setOrigin(0.5, 0.5);
    this.add.existing(startButton);

    const self = this;
    startButton.on("pointerdown", (x: Phaser.Input.Pointer) => {
      startButton.setAlpha(0);
      switchLevel(self, level);
    });
  }

  private victory() {
    // const startButton = this.add
    //   .text(
    //     this.width / 2,
    //     this.height / 2,
    //     "Success, 恭喜逃出地狱之地!!! 点我再来一次",
    //     { fontFamily: "Times New Roman, Times, serif" }
    //   )
    //   .setInteractive()
    //   .setOrigin(0.5, 0.5);

    const startButton = new Text(
      this,
      this.width / 2,
      this.height / 2,
      "Success, 恭喜逃出地狱之地!!! 点我再来一次"
    );
    startButton.setInteractive().setOrigin(0.5, 0.5);
    this.add.existing(startButton);

    const self = this;
    startButton.on("pointerdown", (x: Phaser.Input.Pointer) => {
      startButton.setAlpha(0);
      switchLevel(self, 1);
    });
  }

  private next(level: tLevel) {
    let tips = "恭喜过关! 即将切换到下一关";

    // const startButton = this.add
    //   .text(this.width / 2, this.height / 2, tips, {
    //     fontFamily: "Times New Roman, Times, serif",
    //   })
    //   .setInteractive()
    //   .setOrigin(0.5, 0.5);
    const startButton = new Text(this, this.width / 2, this.height / 2, tips);
    startButton.setInteractive().setOrigin(0.5, 0.5);
    this.add.existing(startButton);

    switchLevel(this, level);
  }
}
