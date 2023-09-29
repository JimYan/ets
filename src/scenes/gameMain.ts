import { Scene } from "phaser";
import {
  PARAMETERS,
  tLevel,
  dudeStatus,
  EVENTS_NAME,
  gameStatus,
} from "../config/constant";
import { Dude } from "../classes/dude";
import { createPoisonAnimiTimer, ceateDudePosionTimer } from "../classes/timer";
import { Text } from "../classes/text";
import { getObjXY, switchLevel } from "../classes/utils";
import CountdownText from "../classes/CountdownText";
type tOrigin = "left" | "right" | "up" | "down" | "turn";
export class GameScene extends Scene {
  fires!: Phaser.Physics.Arcade.Group;
  antidotes!: Phaser.Physics.Arcade.Group;
  dude!: Dude;
  props!: { level: tLevel };
  map!: Phaser.Tilemaps.Tilemap;
  private params!: typeof PARAMETERS.level_1;
  level: tLevel = 1;
  bgLayer!: Phaser.Tilemaps.TilemapLayer;
  wallLayer!: Phaser.Tilemaps.TilemapLayer;
  antidoteLayer!: Phaser.Tilemaps.TilemapLayer;
  exitLayer!: Phaser.Tilemaps.TilemapLayer;
  pointerLayer!: Phaser.Tilemaps.ObjectLayer;
  posionTimer!: Phaser.Time.TimerEvent;
  _status: gameStatus = gameStatus.load; // 游戏状态
  scaleX: number = 1;
  scaleY: number = 1;
  private _directionX: tOrigin = "turn";
  private _directionY: tOrigin = "turn";
  constructor() {
    super("game-scene");
  }

  get status() {
    return this._status;
  }

  getDirectionX() {
    return this._directionX;
  }

  set status(s: gameStatus) {
    this._status = s;
    this.game.events.emit(EVENTS_NAME.gameStatusChange, s);
  }

  preload(): void {}

  create(props: { level: tLevel }): void {
    // console.log(props);
    this._status = gameStatus.start;
    this.params = PARAMETERS[`level_${props.level}`];
    this.level = props.level || 1;
    this.props = props;
    if (!this.game.device.os.desktop) {
      if (
        this.game.device.os.iOS &&
        typeof DeviceOrientationEvent !== undefined
      ) {
        this.mobileStart(); // 在ios下，通过引导用户点击屏幕来启动游戏
      } else {
        // 安卓下，直接倒计时，然后监听事件。
        this.startCountDown(() => {
          window.addEventListener(
            "deviceorientation",
            this.handleOrientation.bind(this),
            true
          );
        });
      }
    } else {
      this.startCountDown();
    }
  }

  private handleOrientation(event: DeviceOrientationEvent): void {
    // console.log("x");
    var alpha = event.alpha as number; // 设备绕z轴的旋转角度
    var beta = event.beta as number; // 设备绕x轴的旋转角度
    var gamma = event.gamma as number; // 设备绕y轴的旋转角度

    console.log(gamma);
    const diffX = 10;
    const diffY = 5;

    if ((gamma as number) > diffX) {
      this._directionX = "right";
      console.log("right");
    } else if (gamma < -diffX) {
      console.log("left");
      this._directionX = "left";
    } else if (beta > diffY) {
      this._directionX = "down";
    } else if (beta < -diffY) {
      this._directionX = "up";
    } else {
      this._directionX = "turn";
    }
  }

  private _init() {
    const width = this.game.scale.width;
    const height = this.game.scale.height;

    this.initMap(this.props.level); // 初始化地图
    this.initDude(); // 初始化精灵
    this.initFire(); // 初始化火苗
    this.initAntidote(); // 初始化解药

    this.physics.world.setBounds(0, 0, width, height); // 设置世界边沿区域
    this.physics.add.collider(this.dude, this.wallLayer); // 设置精灵和墙体的碰撞
    this.physics.add.collider(this.fires, this.wallLayer); // 设置火苗和墙体的碰撞
    this.physics.add.collider(this.fires, this.exitLayer); // 设置火苗和出口的碰撞

    this.initDudePhysic(); // 初始化精灵的物理逻辑
    this.initPosion(); // 初始化毒气逻辑
    this.initListeners(); // 初始化游戏事件
    this.status = gameStatus.start;
  }

  private mobileStart() {
    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const start = this.add
      .text(width / 2, height / 2, "点我游戏开始", {
        fontSize: "64px",
        color: "#fff",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5);

    start.on("pointerup", (x: Phaser.Input.Pointer) => {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: any) => {
          if (response == "granted") {
            // this.mobileStart();
            start.setAlpha(0);
            this.startCountDown(() => {
              window.addEventListener(
                "deviceorientation",
                this.handleOrientation.bind(this),
                true
              );
              start.destroy();
            });
          }
        })
        .catch((e: any) => {
          alert(e);
        });
    });
  }

  private startCountDown(cb?: () => void) {
    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const self = this;
    const countdownText = new CountdownText(
      this,
      width / 2,
      height / 2,
      ["3", "2", "1", "Go!"],
      () => {
        self._init();
        cb && cb();
      }
    );
    this.add.existing(countdownText);
  }

  /**
   * 初始化地图
   * @param level 当前关卡
   */
  private initMap(level: tLevel) {
    const width = this.game.scale.width;
    const height = this.game.scale.height;
    const map = this.make.tilemap({
      key: `map${level}`,
      // tileWidth: 32,
      // tileHeight: 32,
      // width: 30,
      // height: 20,
    }); // 加载地图
    // map.setP
    this.map = map;
    // map.tileToWorldXY()
    const mapSprite = map.addTilesetImage(
      "sprite",
      "mapSprite"
    ) as Phaser.Tilemaps.Tileset; // 加载地图的图集

    let x = 0;
    let y = 0;
    this.bgLayer = map.createLayer(
      "bg",
      mapSprite,
      x,
      y
    ) as Phaser.Tilemaps.TilemapLayer; // 创建背景图层
    const isDesktop = this.game.device.os.desktop;
    // 如果是非手机，那么做到宽度自适应.
    if (isDesktop && width < this.bgLayer.width) {
      this.scaleX = width / this.bgLayer.width;
      this.scaleY = this.scaleX;
      if (height < this.bgLayer.height * this.scaleY) {
        this.scaleY =
          (height / (this.bgLayer.height * this.scaleX)) * this.scaleX;
        this.scaleX = this.scaleY;
      }
    }
    // else if (height < this.bgLayer.height) {
    //   this.scaleX = height / this.bgLayer.height;
    //   this.scaleY = this.scaleX;

    //   if (width < this.bgLayer.width * this.scaleX) {
    //     this.scaleX =
    //       (width / (this.bgLayer.width * this.scaleX)) * this.scaleX;
    //     this.scaleY = this.scaleX;
    //   }
    // }
    else {
      this.scaleX = 1;
      this.scaleY = 1;
    }

    // this.scaleX = 1;
    // this.scaleY = 1;
    this.bgLayer.setScale(this.scaleX, this.scaleY);

    if (this.game.device.os.desktop || true) {
      x = width / 2 - (this.bgLayer.width * this.scaleX) / 2;
      if (x < 0) {
        x = 0;
      }
      console.log(x, width, this.bgLayer);
      this.bgLayer.setX(x);
    }

    this.wallLayer = map.createLayer(
      "wall",
      mapSprite,
      x,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建墙体图层
    this.wallLayer.setCollisionByProperty({ collides: true }); // 设置墙的碰撞属性
    this.wallLayer.setScale(this.scaleX, this.scaleY);

    this.exitLayer = map.createLayer(
      "exit",
      mapSprite,
      x,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建墙体图层
    this.exitLayer.setCollisionByProperty({ collides: true }); // 设置墙的碰撞属性
    this.exitLayer.setScale(this.scaleX, this.scaleY);

    this.antidoteLayer = map.createLayer(
      "antidote",
      mapSprite,
      x,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建解药图层
    this.antidoteLayer.setScale(this.scaleX, this.scaleY);
    this.antidoteLayer.setCollisionByProperty({ collides: true }); // 设置墙的碰撞属性

    this.pointerLayer = map.getObjectLayer(
      "pointer"
    ) as Phaser.Tilemaps.ObjectLayer; // 获取地图中的标记对象图层。

    // console.log(scaleX, scaleY);
    // this.pointerLayer
  }

  /**
   * 初始化精灵
   */
  private initDude() {
    // 初始化精灵
    const spritePointer = this.pointerLayer.objects.filter(
      (obj) => obj.name === "sprite"
    )[0];
    // console.log(this.map);
    // console.log(this.pointerLayer);

    const [x, y] = getObjXY(spritePointer, this.map, this.scaleX);
    this.dude = new Dude(this, x, y, this.level);
    this.dude.setScale(this.scaleX, this.scaleY);

    // this.cameras.main.startFollow(this.dude, true, 0.5, 0.5);
  }

  private initAntidote() {
    const points = this.pointerLayer.objects.filter(
      (obj) => obj.name === "antidote"
    );
    this.antidotes = this.physics.add.group({
      key: "sprite",
      repeat: points.length - 1,
      frame: ["antidote"],
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,

      "setScale.x": this.scaleX,
      "setScale.y": this.scaleY,

      setXY: { x: -100, y: -100 }, // 设置初始x和y坐标, 并且设置每一个间隔的X
    });

    const self = this;

    this.antidotes.children.iterate((obj: any, i: number) => {
      // console.log(i);
      // console.log(obj);
      const [x, y] = getObjXY(points[i], this.map, this.scaleX);
      (obj as Phaser.Physics.Arcade.Sprite).x = x;
      (obj as Phaser.Physics.Arcade.Sprite).y = y;
      obj.setScale(self.scaleX, self.scaleY);
      return null;
    });
  }

  /**
   * 初始化精灵的物理逻辑
   */
  private initDudePhysic() {
    const self = this;

    // 精灵和解药的触碰
    this.physics.add.overlap(this.dude, this.antidotes, (a, b) => {
      self.dude.addAntidote();
      b.destroy();
    });

    // 精灵和火苗碰撞
    this.physics.add.overlap(this.dude, this.fires, () => {
      self.posionTimer.destroy();
      self.dude.status = dudeStatus.sparks;
    });
  }

  /**
   * 初始化毒气逻辑
   */
  private initPosion() {
    const self = this;
    createPoisonAnimiTimer(this, this.pointerLayer, this.map); // 创建毒药的动画
    this.posionTimer = ceateDudePosionTimer(this.dude); // 设置每秒给精灵增加毒药剂量
    this.physics.add.overlap(this.dude, this.exitLayer, (a: any, b: any) => {
      const tile = self.exitLayer.getTileAtWorldXY(a.x, a.y);
      if (tile && tile.properties?.name == "exit") {
        self.posionTimer.destroy(); // 定时器关闭
        self.dude.status = dudeStatus.victory;
      }
    });
  }

  /**
   * 初始化游戏事件
   */
  private initListeners() {
    this.game.events.on(
      EVENTS_NAME.dudeStatusChange,
      this.dudeStatusChange,
      this
    );
  }

  /**
   * 初始化火苗逻辑
   */
  private initFire() {
    const firePointer = this.pointerLayer.objects.filter(
      (obj) => obj.name === "fire"
    )[0];
    const [x, y] = getObjXY(firePointer, this.map, this.scaleX);
    this.fires = this.physics.add.group({
      key: "sprite",
      repeat: this.params.sparksNumber,
      frame: ["fire-2"],
      setScale: {
        x: 0.05 * this.scaleX,
        y: 0.05 * this.scaleY,
      },

      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,

      setXY: { x, y }, // 设置初始x和y坐标, 并且设置每一个间隔的X
    });
    this.fires.playAnimation("fire"); // 播放火苗动画
    const self = this;
    this.fires.children.iterate((child: any, index: number): any => {
      //  Give each star a slightly different bounce
      const speed = Phaser.Math.FloatBetween(
        index % 2 === 0
          ? -this.params.sparksSpeed[0]
          : this.params.sparksSpeed[0],
        index % 2 === 0
          ? -this.params.sparksSpeed[1]
          : this.params.sparksSpeed[1]
      );
      child.setVelocity(speed);
    }); // 给每个星星一个稍微不同的弹跳
  }

  update(): void {
    // this.cameras.main.scrollX += 10;

    this.dude && this.dude.update();
  }

  private dudeStatusChange(s: dudeStatus) {
    // console.log(s, this);
    const self = this;
    switch (s) {
      case dudeStatus.posion:
      case dudeStatus.sparks:
        this.physics.pause();
        self.status = gameStatus.fail;
        this.scene.start("end-scene", {
          status: gameStatus.fail,
          level: this.level,
          dudeStatus: s,
        });
        break;
      case dudeStatus.victory:
        this.physics.pause();
        let toLevel = this.level;
        if (this.level >= 3) {
          self.status = gameStatus.victory;
        } else {
          self.status = gameStatus.next;
          toLevel = (this.level + 1) as tLevel;
        }
        this.add
          .timeline([
            {
              at: 1000,
              run: () => {
                this.scene.start("end-scene", {
                  status: self.status,
                  level: toLevel,
                });
              },
            },
          ])
          .play();
        break;
    }
  }
}
