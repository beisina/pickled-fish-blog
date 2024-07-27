import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        {
            text: "必看",
            icon: "star",
            prefix: "guide/",
            link: "guide/",
            children: "structure",
        },
        {
            text: "python",
            icon: "/assets/icon/python.svg",
            prefix: "posts/python",
            children: [
                {
                    text: "基础",
                    icon: "layer-group",
                    children: []
                },
                "profile",
                "environment-construction",
                {
                    text: "数据类型",
                    icon: "list",
                    children: []
                },
                "string",
                "bool-and-numbers",
                "operators-and-prioritization"
            ],
            collapsible: true,
            expanded: false,
        },
        {
            text: "golang",
            icon: "/assets/icon/golang.svg",
            prefix: "posts/golang",
            children: "structure",
            collapsible: true,
            expanded: false,
        },
        "intro"
    ]
});
