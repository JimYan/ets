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
import { switchLevel } from "../classes/utils";

export class GameScene extends Scene {
  fires!: Phaser.Physics.Arcade.Group;
  antidotes!: Phaser.Physics.Arcade.Group;
  dude!: Dude;
  private params!: typeof PARAMETERS.level_1;
  level: tLevel = 1;
  bgLayer!: Phaser.Tilemaps.TilemapLayer;
  wallLayer!: Phaser.Tilemaps.TilemapLayer;
  antidoteLayer!: Phaser.Tilemaps.TilemapLayer;
  pointerLayer!: Phaser.Tilemaps.ObjectLayer;
  posionTimer!: Phaser.Time.TimerEvent;
  _status: gameStatus = gameStatus.start; // 游戏状态
  constructor() {
    super("game-scene");
  }

  get status() {
    return this._status;
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
    const width = this.game.scale.width;
    const height = this.game.scale.height;

    this.initMap(props.level); // 初始化地图
    this.initDude(); // 初始化精灵
    this.initFire(); // 初始化火苗
    this.initAntidote(); // 初始化解药

    this.physics.world.setBounds(0, 0, width, height); // 设置世界边沿区域
    this.physics.add.collider(this.dude, this.wallLayer); // 设置精灵和墙体的碰撞
    this.physics.add.collider(this.fires, this.wallLayer); // 设置火苗和墙体的碰撞

    this.initDudePhysic(); // 初始化精灵的物理逻辑
    this.initPosion(); // 初始化毒气逻辑
    this.initListeners(); // 初始化游戏事件
  }

  /**
   * 初始化地图
   * @param level 当前关卡
   */
  private initMap(level: tLevel) {
    const width = this.game.scale.width;
    const map = this.make.tilemap({
      key: `map${level}`,
      tileWidth: 32,
      tileHeight: 32,
    }); // 加载地图

    const mapSprite = map.addTilesetImage(
      "sprite",
      "mapSprite"
    ) as Phaser.Tilemaps.Tileset; // 加载地图的图集

    this.bgLayer = map.createLayer(
      "bg",
      mapSprite,
      0,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建背景图层
    // this.bgLayer.setOrigin(0.5, 0.5);

    this.wallLayer = map.createLayer(
      "wall",
      mapSprite,
      0,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建墙体图层
    this.wallLayer.setCollisionByProperty({ collides: true }); // 设置墙的碰撞属性

    this.antidoteLayer = map.createLayer(
      "antidote",
      mapSprite,
      0,
      0
    ) as Phaser.Tilemaps.TilemapLayer; // 创建解药图层
    this.antidoteLayer.setCollisionByProperty({ collides: true }); // 设置墙的碰撞属性

    this.pointerLayer = map.getObjectLayer(
      "pointer"
    ) as Phaser.Tilemaps.ObjectLayer; // 获取地图中的标记对象图层。
  }

  /**
   * 初始化精灵
   */
  private initDude() {
    // 初始化精灵
    const spritePointer = this.pointerLayer.objects.filter(
      (obj) => obj.name === "sprite"
    )[0];
    this.dude = new Dude(
      this,
      spritePointer.x as number,
      spritePointer.y as number,
      this.level
    );
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

      setXY: { x: -100, y: -100 }, // 设置初始x和y坐标, 并且设置每一个间隔的X
    });

    const self = this;

    this.antidotes.children.iterate((obj: any, i: number) => {
      // console.log(i);
      // console.log(obj);
      (obj as Phaser.Physics.Arcade.Sprite).x = points[i].x as number;
      (obj as Phaser.Physics.Arcade.Sprite).y = points[i].y as number;
      return null;
    });
  }

  /**
   * 初始化精灵的物理逻辑
   */
  private initDudePhysic() {
    const self = this;
    // 精灵和解药触碰，精灵体内解药相加
    // this.physics.add.overlap(
    //   this.dude,
    //   this.antidoteLayer,
    //   (a: any, b: any) => {
    //     const tile = self.antidoteLayer.getTileAtWorldXY(a.x, a.y);
    //     if (tile) {
    //       // console.log(tile);
    //       self.antidoteLayer.removeTileAtWorldXY(a.x, a.y);
    //       self.dude.addAntidote();
    //     }
    //   }
    // );

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
    createPoisonAnimiTimer(this, this.pointerLayer); // 创建毒药的动画
    this.posionTimer = ceateDudePosionTimer(this.dude); // 设置每秒给精灵增加毒药剂量
    this.physics.add.overlap(this.dude, this.wallLayer, (a: any, b: any) => {
      const tile = self.wallLayer.getTileAtWorldXY(a.x, a.y);
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
    const [x, y] = [firePointer.x as number, firePointer.y as number];
    this.fires = this.physics.add.group({
      key: "sprite",
      repeat: this.params.sparksNumber,
      frame: ["fire-2"],
      setScale: {
        x: 0.05,
        y: 0.05,
      },

      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,

      setXY: { x, y }, // 设置初始x和y坐标, 并且设置每一个间隔的X
    });
    this.fires.playAnimation("fire"); // 播放火苗动画
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
    this.dude.update();
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
