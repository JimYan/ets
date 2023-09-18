import { Scene, Sound } from "phaser";

import { Text } from "../classes/text";
import { EVENTS_NAME, dudeStatus } from "../config/constant";

export class GameUiScene extends Scene {
  private posionText!: Text;
  private tipsText!: Text;

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
    this.tipsText = new Text(this, width / 2 - 50, 10, `第${props.level}关`);
    this.add.existing(this.tipsText);

    this.posionText = new Text(this, width / 2 + 50, 10, "毒气:0");
    this.add.existing(this.posionText);
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
        break;
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
  }
}
