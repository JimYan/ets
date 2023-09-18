import { Game, Scale, Types, WEBGL, AUTO } from "phaser";
import * as Phaser from "phaser";
import SoundFadePlugin from "phaser3-rex-plugins/plugins/soundfade-plugin.js";
// import "phaser/plugins/spine/dist/SpinePlugin";
// import * as spine from "@esotericsoftware/spine-phaser";

// import "phaser/types/SpineContainer";

// import {   UIScene, EndScene } from "./scenes";
// import { CatScene } from "./scenes/cat";
import { GameScene } from "./scenes/gameMain";
import { StartScene } from "./scenes/start";
import { EndScene } from "./scenes/end";
import { GameUiScene } from "./scenes/gameUi";
import { AudioScene } from "./scenes/audio";

type GameConfigExtended = Phaser.Types.Core.GameConfig & {
  winScore: number;
};

export const gameConfig: GameConfigExtended = {
  type: AUTO,
  parent: "app",
  backgroundColor: "#9bd4c3",
  plugins: {
    global: [
      {
        key: "rexSoundFade",
        plugin: SoundFadePlugin,
        start: true,
      },
      // {
      //   key: "rexDrag",
      //   plugin: DragPlugin,
      //   start: true,
      // },
      // ...
    ],
    scene: [
      // { key: "spine.SpinePlugin", plugin: spine.SpinePlugin, mapping: "spine" },
    ],
  },
  scale: {
    mode: Scale.RESIZE,
  },
  width: 375,
  height: 667,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  // scene: [DemoScene],
  // scene: [LoadingScene, GameScene, UIScene, AudioScene],
  scene: [StartScene, GameScene, GameUiScene, EndScene, AudioScene],
  winScore: 100,
};

function sizeChanged() {
  // if (window.game.isBooted) {
  //   setTimeout(() => {
  //     window.game.scale.resize(window.innerWidth, window.innerHeight);
  //     window.game.canvas.setAttribute(
  //       "style",
  //       `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
  //     );
  //   }, 100);
  // }
}

window.onresize = () => sizeChanged();

// const button = document.querySelector("#btnStart");

// (button as Element).addEventListener("click", () => {
//   // var game = new Phaser.Game();
//   button?.remove();
//   window.game = new Game(gameConfig);
// });
window.game = new Game(gameConfig);
