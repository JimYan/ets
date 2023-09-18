# 逃出生天游戏

> 本仓库是使用 TS + Phaser3 + Tiled 实现的逃出生天小游戏的源码，同时也是某学校的软件设计期末考试材料，仅供大家参考学习使用，本系统不会涉及到任何商业应用。

逃出生天游戏设计：https://tungsten-dewberry-df7.notion.site/a7d836c289fe479f9fd17a4352e41a37

在线体验地址：https://jimyantest2.oss-cn-shenzhen.aliyuncs.com/index.html

> 在线体验仅支持 PC 端参与体验，进入游戏后使用键盘的方向键来控制精灵的移动方向

## Setup

**开发环境要求**

- NodeJS@18
- PNPM@8

```bash
# 安装依赖
$ pnpm i
```

**开发命令参考**

```bash
# 本地开发
$ pnpm dev

# 编译，编译产物输出目录为./dist/
$ pnpm build
```

**主要文件说明**

```
./src/
├── classes
│   ├── CountdownText.ts #倒计时类
│   ├── actor.ts #精灵基类
│   ├── dude.ts #精灵
│   ├── text.ts #文本类
│   ├── timer.ts #定时器
│   └── utils.ts #游戏切换关卡类
├── config
│   └── constant.ts #游戏参数配置
├── index.ts # 游戏入口
├── scenes #场景
│   ├── end.ts #结束场景
│   ├── gameMain.ts #游戏主场景
│   ├── gameUi.ts #游戏UI场景
│   └── start.ts #开始游戏场景
├── types
│   └── global.d.ts
└── vite-env.d.ts
./public
└── assets
├── map 地图关卡文件
├── sprite 图标目录
└── spriteSheet 图标合并目录
├── spritesheet.png
└── spritesheet_atlas.json 图标合并配置
```

## Feature

- [ ] 新增游戏音效
- [ ] 新增移动端支持

## 第三方资源声明

本项目包含了一些来自第三方的图片资源，在此声明这些资源的来源:

1. **antidote.png co2.png fire-2.png fire-3.png map/sprite.png** 来自https://www.flaticon.com/下载。
2. **spritesheet.png** 使用https://gammafp.com/tool/atlas-packer/工具生成。

如果您有任何关于这些资源的疑问或投诉，请随时联系我，我将尽力解决问题。

## 许可

这个项目采用 [MIT 许可证](LICENSE)。请仔细阅读许可证，以了解您可以做什么以及什么是不允许的。
