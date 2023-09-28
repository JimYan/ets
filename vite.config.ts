/** @type {import('vite').UserConfig} */

import { ConfigEnv, UserConfigExport } from "vite";
import { viteVConsole } from "vite-plugin-vconsole";
import { resolve } from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import * as fs from "fs";

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  console.log(mode);
  return {
    // ...
    base: "/ets",
    build: {
      outDir: "ets",
    },
    server: {
      host: "0.0.0.0",
      port: 8001,

      // https: true,
    },
    plugins: [
      // basicSsl(),
      // viteVConsole({
      //   entry: resolve(__dirname, "./src/index.ts"),
      //   localEnabled: true,
      //   enabled: mode !== "production" && mode !== "test",
      //   config: {
      //     maxLogNumber: 1000,
      //     theme: "light",
      //   },
      // }),
    ],
  };
};
