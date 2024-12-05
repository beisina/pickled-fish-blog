import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "酸菜鱼Blog",
  description: "酸菜鱼的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  host: 'localhost', // ip
  port: 8080, //端口号
});
