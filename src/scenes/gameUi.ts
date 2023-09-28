import { Scene, Sound } from "phaser";

import { Text } from "../classes/text";
import {
  EVENTS_NAME,
  dudeStatus,
  gameStatus,
  tLevel,
} from "../config/constant";

export class GameUiScene extends Scene {
  private posionText!: Text;
  private tipsText!: Text;
  private tips!: Text;
  private props!: { level: tLevel };

  constructor() {
    super("ui-scene");
  }

  create(props: any): void {
    const width = this.scale.width as number;
    const height = this.scale.height as number;
    this.add
      .tileSprite(0, 0, width, height, "grass")
      .setAlpha(0.2)
      .setOrigin(0, 0);
    this.props = props;
    this.initListeners();
  }

  /**
   * 体内毒气变化
   * @param t
   */
  private dudePosionChange(t: number) {
    this.posionText && this.posionText.setText(`毒气:${t < 0 ? 0 : t}`);
  }

  /**
   * 精灵状态变化
   * @param s
   */
  private dudeStatusChange(s: dudeStatus) {
    const width = this.scale.width as number;
    switch (s) {
      case dudeStatus.victory:
      case dudeStatus.posion:
      case dudeStatus.sparks:
        this.tipsText.setVisible(false);
        this.posionText.setVisible(false);
        this.tips.setVisible(false);
        break;
    }
  }

  private gameStatusChange(s: gameStatus) {
    const width = this.scale.width as number;
    const height = this.scale.height as number;
    if (s === gameStatus.start) {
      const tipsTxt = this.game.device.os.desktop
        ? "按方向键上下左右控制精灵"
        : "通过转动手机，让陀螺仪来控制精灵方向";
      this.tips = new Text(this, width / 2, height, tipsTxt)
        .setScale(1.5)
        .setOrigin(0.5, 1);
      this.add.existing(this.tips);

      this.tipsText = new Text(
        this,
        width / 2 - 50,
        height - this.tips.height - 10,
        `第${this.props.level}关`
      )
        .setOrigin(0.5, 1)
        .setScale(1.5);
      this.add.existing(this.tipsText);

      this.posionText = new Text(
        this,
        width / 2 + 50,
        height - this.tips.height - 10,
        "毒气:0"
      )
        .setOrigin(0.5, 1)
        .setScale(1.5);
      this.add.existing(this.posionText);
    }
  }

  private initListeners(): void {
    this.game.events.on(
      EVENTS_NAME.dudePosionChange,
      this.dudePosionChange,
      this
    );
    this.game.events.on(
      EVENTS_NAME.dudeStatusChange,
      this.dudeStatusChange,
      this
    );
    this.game.events.on(
      EVENTS_NAME.gameStatusChange,
      this.gameStatusChange,
      this
    );
  }
}
