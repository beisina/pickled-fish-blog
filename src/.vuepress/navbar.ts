import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    "/demo/",
    {
        text: "Python",
        icon: "pen-to-square",
        prefix: "/posts/",
        children: [
            {
                text: "入门",
                icon: "pen-to-square",
                prefix: "python/",
                children: [
                    {
                        text: "python介绍",
                        icon: "pen-to-square",
                        link: "profile"
                    },
                    {
                        text: "python安装",
                        icon: "pen-to-square",
                        link: "environment-construction"
                    },
                ],
            },
            {
                text: "基础",
                icon: "pen-to-square",
                prefix: "python/",
                children: [
                    {
                        text: "hello world",
                        icon: "pen-to-square",
                        link: "3"
                    }
                ],
            }
        ],
    },
    {
        text: "杂七杂八",
        icon: "pen-to-square",
        prefix: "/posts/",
        children: [
            {
                text: "介绍",
                link: "intro",
            }
        ]
    },
]);
