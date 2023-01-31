import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import legacy from "@vitejs/plugin-legacy";
import { dynamicBase } from "vite-plugin-dynamic-base";
import devtools from "solid-devtools/vite";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@solidjs/router": path.resolve(__dirname, "solid-router/src")
    }
  },
  plugins: [
    solidPlugin(),
    legacy({
      targets: ["defaults"]
    }),
    dynamicBase({
      // dynamic public path var string, default window.__dynamic_base__
      publicPath: "window.__dynamic_base__",
      // dynamic load resources on index.html, default false. maybe change default true
      transformIndexHtml: true
    }),
    devtools({
      /* additional options */
      autoname: true, // e.g. enable autoname
      locator: {
        targetIDE: "webstorm",
        componentLocation: true,
        jsxLocation: true,
      },
    })
  ],
  base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
  // base: "/",
  build: {
    // target: "es2015", //next
    // polyfillDynamicImport: false,
  }
  // experimental: {
  //   renderBuiltUrl: (filename, { type, hostId, hostType }) => {
  //     if (type === "asset") {
  //       return { runtime: `window.ALIST.cdn/${filename}` };
  //     }
  //     return { relative: true };
  //   },
  // },
});
