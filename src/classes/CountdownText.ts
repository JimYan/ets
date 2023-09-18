// CountdownText.js
import * as Phaser from "phaser";

export default class CountdownText extends Phaser.GameObjects.Text {
  private timeline!: Phaser.Tweens.TweenChain;
  private texts = ["3", "2", "1", "Read Go"];
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texts?: Array<string>,
    cb?: () => void
  ) {
    super(scene, x, y, "1", { fontSize: "64px", color: "#fff" });
    this.scene = scene;
    this.setOrigin(0.5);

    if (texts) {
      this.texts = texts;
    }

    const self = this;
    // 创建 tweens 时间线
    this.timeline = scene.tweens.chain(this.getConfig(cb));

    this.timeline.play();
    // 启动时间线
  }

  getConfig(cb?: () => void) {
    const self = this;
    const dingMusic = this.scene.sound.add("ding", {
      loop: false,
      volume: 0.3,
    });
    const goMusic = this.scene.sound.add("go", {
      loop: false,
      volume: 0.5,
    });

    const tween: {
      scaleX: number;
      scaleY: number;
      alpha: number;
      duration: number;
      ease: string;
      onStart?: () => void;
    }[] = [];
    this.texts.forEach((t, i) => {
      tween.push({
        scaleX: 3,
        scaleY: 3,
        alpha: 1,
        duration: 500, // 放大的持续时间为 500 毫秒
        ease: "Power2",
        onStart: () => {
          // 每个数字放大动画开始时设置文本
          self.setText(t);
        },
      });
      tween.push({
        // targets: this,
        scaleX: 1,
        scaleY: 1,
        alpha: 0,
        duration: 500, // 放大的持续时间为 500 毫秒
        ease: "Power2",
        onStart: () => {
          self.texts.length === i + 1 ? goMusic.play() : dingMusic.play();
        },
      });
    });
    return {
      targets: this,
      paused: true,
      tweens: tween,
      onComplete: () => {
        cb ? cb() : null;
      },
    };
  }

  restart() {
    this.setScale(1, 1);
    this.setAlpha(1);
    this.setText(this.texts[0]);
    this.scene.tweens.chain(this.getConfig()).play();
  }
}
