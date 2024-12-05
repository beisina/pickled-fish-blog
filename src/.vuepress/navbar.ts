import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "学习指南",
        icon: "bookmark",
        link: "/guide.html",
    },
    {
        text: "杂七杂八",
        icon: "bookmark",
        prefix: "/posts/",
        children: []
    },
]);
