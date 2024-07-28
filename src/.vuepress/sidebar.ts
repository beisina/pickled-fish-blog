import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "python",
            icon: "/assets/icon/python.svg",
            prefix: "guide/python",
            children: [
                {
                    text: "基础",
                    icon: "layer-group",
                    children: []
                }, {
                    text: "1.1 python简介",
                    link: "profile",
                }, {
                    text: "1.2 python环境搭建",
                    link: "environment-construction",
                },
                {
                    text: "数据类型",
                    icon: "list",
                    children: []
                }, {
                    text: "2.1 字符串",
                    link: "string",
                }, {
                    text: "2.2 布尔和数字",
                    link: "bool-and-numbers",
                }, {
                    text: "2.3 运算符和优先级",
                    link: "operators-and-prioritization",
                }, {
                    text: "2.4 列表",
                    link: "list",
                }, {
                    text: "2.5 元组",
                    link: "tuple",
                }, {
                    text: "2.6 集合",
                    link: "set",
                }, {
                    text: "2.7 字典",
                    link: "dict",
                }
            ],
            collapsible: true,
            expanded: false,
        },
        {
            text: "golang",
            icon: "/assets/icon/golang.svg",
            prefix: "guide/golang",
            children: [],
            collapsible: true,
            expanded: false,
        },
        {
            text: "介绍",
            icon: "info",
            prefix: "guide/",
            link: "guide/intro",
        },
    ]
});
