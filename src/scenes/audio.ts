import { Scene, Sound } from "phaser";
import SoundFade from "phaser3-rex-plugins/plugins/soundfade.js";
import { EVENTS_NAME, gameStatus } from "../config/constant";
// import { EVENTS_NAME, GameStatus } from "../consts";
export type iSound =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

export class AudioScene extends Scene {
  private backmusic!: iSound; // 背景音乐
  private running!: iSound; // 跑步音乐
  private pick!: iSound; // 拾取音乐
  private fail!: iSound; // 失败音乐
  private win!: iSound; // 胜利音乐
  private gameStatus: gameStatus = gameStatus.start;

  constructor() {
    super("audio-scene");
  }

  create(props: any): void {
    this.initListeners();

    this.game.sound.setMute(true); // 暂时静音。
    // 背景音乐
    this.backmusic = this.sound.add("bgMusic", { loop: true, volume: 0.3 });
    this.backmusic.play();

    this.running = this.sound.add("running", { loop: false, volume: 0.3 });
    this.pick = this.sound.add("pick", { loop: false, volume: 0.3 });
    this.fail = this.sound.add("fail", { loop: false, volume: 0.3 });
    this.win = this.sound.add("win", { loop: false, volume: 0.3 });
  }

  gameEnd(status: gameStatus): void {
    if (status === gameStatus.start) {
      //   this.backmusic.play();
    } else if (status === gameStatus.fail) {
      this.fail.play();
      this.backmusic.stop();
    } else if (status === gameStatus.victory || status === gameStatus.next) {
      this.win.play();
    }
  }

  private dudeMoving(s: string) {
    if (this.gameStatus !== gameStatus.start) {
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
    this.game.events.on(
      EVENTS_NAME.dudeGetAntidote,
      () => {
        this.pick.play();
      },
      this
    );
  }
}
