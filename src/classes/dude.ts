import { Scene } from "phaser";
import { GameScene } from "../scenes/gameMain";
import { Actor } from "./actor";
import { Text } from "./text";
import {
  PARAMETERS,
  EVENTS_NAME,
  dudeStatus,
  gameStatus,
} from "../config/constant";

type tOrigin = "left" | "right" | "up" | "down" | "turn";

export class Dude extends Actor {
  private hpValue!: Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private params!: typeof PARAMETERS.level_1;
  private poisonNumber = 0; //毒气剂量
  private antidoteNumber = 0; //解药剂量
  private deathPoisonNum = 30;
  private _status = dudeStatus.start;
  // private _directionX: tOrigin = "turn";
  // private _directionY: tOrigin = "turn";
  constructor(scene: GameScene, x: number, y: number, level: 1 | 2 | 3) {
    super(scene, x, y, "sprite", "dude-5");

    this.params = PARAMETERS[`level_${level}`];
    this.deathPoisonNum = this.params.deathPoisonNum;

    this.setBounce(1, 1).setScale(0.8);

    this.initAnimations();
    this.play("turn");

    const keyboard = this.scene.input.keyboard;
    this.cursors = keyboard!.createCursorKeys();
  }

  update(): void {
    if (this.scene === undefined) {
      return;
    }
    // console.log("x");
    const scene = this.scene as GameScene;
    if ((scene as GameScene).status !== gameStatus.start) {
      return;
    }
    const body = this.getBody();
    const speed = this.params.spriteSpeed;

    if (!scene.game.device.os.desktop) {
      this.updateDude(scene.getDirectionX());
      // this.updateDude(this._directionY);
      return;
    }
    // body.setVelocity(0, 0);
    if (this.cursors.left.isDown) {
      this.updateDude("left" as tOrigin);
    } else if (this.cursors.right.isDown) {
      this.updateDude("right" as tOrigin);
    } else if (this.cursors.down.isDown) {
      this.updateDude("down" as tOrigin);
    } else if (this.cursors.up.isDown) {
      this.updateDude("up" as tOrigin);
    } else {
      this.updateDude("turn");
    }
  }

  private updateDude(dorigin: tOrigin) {
    const body = this.getBody();
    const speed = this.params.spriteSpeed;
    if (dorigin === "left") {
      this.getBody().setVelocityX(-speed);
      this.play("run-left", true);
      this.scene.game.events.emit(EVENTS_NAME.dudeMoving, "left");
    } else if (dorigin === "right") {
      this.getBody().setVelocityX(speed);
      this.play("run-right", true);
      this.scene.game.events.emit(EVENTS_NAME.dudeMoving, "right");
    } else if (dorigin === "down") {
      this.play("run-turn", true);
      body.setVelocityY(speed);
      this.scene.game.events.emit(EVENTS_NAME.dudeMoving, "down");
    } else if (dorigin === "up") {
      this.play("run-turn", true);
      body.setVelocityY(-speed);
      this.scene.game.events.emit(EVENTS_NAME.dudeMoving, "up");
    } else {
      this.play("turn");
      body.setVelocity(0, 0);
      this.scene.game.events.emit(EVENTS_NAME.dudeMoving, "stop");
    }
  }

  private initAnimations(): void {
    this.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNames("sprite", {
        start: 0,
        end: 3,
        prefix: "dude-",
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNames("sprite", {
        start: 5,
        end: 8,
        prefix: "dude-",
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "sprite", frame: "dude-4" }],
      frameRate: 20,
    });
  }

  /**
   * 新增毒气接口
   */
  public addPosion() {
    this.poisonNumber += this.params.poisonGasDosage;
    const diff = this.getPosionDiffAntidote();
    if (diff > this.deathPoisonNum) {
      this.status = dudeStatus.posion;
    }
    this.scene.game.events.emit(
      EVENTS_NAME.dudePosionChange,
      this.getPosionDiffAntidote()
    );
  }

  public getPosion() {
    return this.poisonNumber;
  }

  public addAntidote() {
    this.antidoteNumber += this.params.antidoteDosage;
    this.scene.game.events.emit(
      EVENTS_NAME.dudePosionChange,
      this.getPosionDiffAntidote()
    );
    this.scene.game.events.emit(EVENTS_NAME.dudeGetAntidote);
  }

  public getAntidote() {
    return this.antidoteNumber;
  }

  public getPosionDiffAntidote() {
    return this.poisonNumber - this.antidoteNumber;
  }

  set status(s: dudeStatus) {
    this._status = s;
    this.scene.game.events.emit(EVENTS_NAME.dudeStatusChange, s);
  }

  get status() {
    return this._status;
  }
}
