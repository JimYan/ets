export const PARAMETERS = {
  level_1: {
    spriteSpeed: 100, // 精灵速度
    poisonGasDosage: 5, // 毒气剂量
    antidoteQuantity: 5, // 解药数量
    antidoteDosage: 10, // 解药剂量
    sparksNumber: 1, // 火花数量
    sparksSpeed: [10, 18], //火花速度,
    deathPoisonNum: 100, // 死亡剂量
  },
  level_2: {
    spriteSpeed: 120, // 精灵速度
    poisonGasDosage: 8, // 毒气剂量
    antidoteQuantity: 10, // 解药数量
    antidoteDosage: 10, // 解药剂量
    sparksNumber: 1, // 火花数量
    deathPoisonNum: 100,
    sparksSpeed: [110, 130], //火花速度
  },
  level_3: {
    spriteSpeed: 180, // 精灵速度
    poisonGasDosage: 15, // 毒气剂量
    antidoteQuantity: 20, // 解药数量
    antidoteDosage: 10, // 解药剂量
    sparksNumber: 1, // 火花数量
    deathPoisonNum: 100,
    sparksSpeed: [180, 200], //火花速度
  },
};

export type tLevel = 1 | 2 | 3;

export enum EVENTS_NAME {
  dudePosionChange = "dudePosionChange", // dude体内毒气发生变化
  dudeDeathByPosion = "dudeDeathByPosion", //dude被毒死
  dudeStatusChange = "dudeStatusChange", // dude状态变化
  dudeGetAntidote = "dudeGetAntidote", // 获取解药
  dudeMoving = "dudeMoving", // 精灵移动
  gameStatusChange = "gameStatusChange", // 游戏状态变化
}

// 精灵状态
export enum dudeStatus {
  start, // 初始
  posion, // 被毒气
  sparks, // 被烫死
  victory, // 通关
}

// 游戏状态
export enum gameStatus {
  load, // 游戏加载
  start, // 开始游戏
  next, // 下一关
  fail, // 失败
  victory, // 胜利
}
