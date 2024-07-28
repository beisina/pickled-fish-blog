import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    "/guide",
    {
        text: "杂七杂八",
        icon: "bookmark",
        prefix: "/posts/",
        children: []
    },
]);
