import { Scene, Sound } from "phaser";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade.js";
import { EVENTS_NAME, gameStatus } from "../config/constant";
// import { EVENTS_NAME, GameStatus } from "../consts";
export type iSound =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

export class AudioScene extends Scene {
  private backmusic!: iSound;
  private ao!: iSound;
  private crash3!: iSound;
  private pi!: iSound;
  private running!: iSound;
  private gameStatus: gameStatus = gameStatus.start;

  constructor() {
    super("audio-scene");
  }

  create(props: any): void {
    this.initListeners();

    // 背景音乐
    this.backmusic = this.sound.add("bgMusic", { loop: true, volume: 0.3 });
    this.backmusic.play();

    this.running = this.sound.add("running", { loop: true, volume: 0.3 });
    // this.running.play();
    // this.backmusic.play({ loop: true, volume: 0.1 });

    // this.ao = this.sound.add("fashe"); // 发射子弹
    // this.crash3 = this.sound.add("crash3"); // 被敌机击中
    // this.pi = this.sound.add("pi"); // 击中敌机
  }

  gameEnd(status: gameStatus): void {
    this.gameStatus = status;
    // if (status === GameStatus.PAUSE) {
    //   this.backmusic.stop();
    // } else if (status === GameStatus.PLAYING) {
    //   console.log("play");
    //   this.backmusic.play({ loop: true, volume: 0.3 });
    // }
  }

  // 击中敌机
  shoot(): void {
    // SoundFade.fadeIn(this.pi, 3000);
    this.pi.play();
  }

  // 被敌机击中
  attach(): void {
    this.crash3.play();
    // SoundFade.fadeIn(this.crash3, 3000);
    console.log("attach");
    // this.crash3.fadeIn(1000);
  }

  // 发射子弹
  newbullet(): void {
    this.ao.play({
      volume: 0.3,
    });
  }

  private dudeMoving(s: string) {
    console.log(s);
    if (this.gameStatus !== gameStatus.start) {
      this.running.setVolume(0);
      return;
    }
    if (s === "stop") {
      this.running.isPlaying ? this.running?.pause() : "";
    } else {
      this.running.isPlaying ? "" : this.running.play();
    }
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.dudeMoving, this.dudeMoving, this); // 精灵移动
    this.game.events.on(EVENTS_NAME.gameStatusChange, this.gameEnd, this); // 游戏结束
    // this.game.events.on(EVENTS_NAME.gameStatus, this.gameEnd, this); // 游戏结束
    // this.game.events.on(EVENTS_NAME.planeAttack, this.attach, this); // 被敌机击中
    // this.game.events.on(EVENTS_NAME.shoot, this.shoot, this); // 击中敌机
    // this.game.events.on(EVENTS_NAME.newBullet, this.newbullet, this); // 发射子弹
  }
}
