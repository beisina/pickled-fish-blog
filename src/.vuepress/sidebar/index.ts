import {sidebar} from "vuepress-theme-hope";

export default sidebar({
        "/": [
            "",
            {
                text: "python",
                icon: "/assets/icon/python.svg",
                prefix: "python",
                children: [
                    {
                        text: "基础",
                        icon: "layer-group",
                        children: []
                    }, {
                        text: "1.1 简介",
                        link: "start/profile",
                    }, {
                        text: "1.2 环境搭建",
                        link: "start/environment-construction",
                    }, {
                        text: "基本数据类型",
                        icon: "bars",
                        children: []
                    }, {
                        text: "2.1 字符串",
                        link: "basic-data-type/string",
                    }, {
                        text: "2.2 布尔和数字",
                        link: "basic-data-type/bool-and-numbers",
                    }, {
                        text: "2.3 运算符和优先级",
                        link: "basic-data-type/operators-and-prioritization",
                    }, {
                        text: "2.4 列表",
                        link: "basic-data-type/list",
                    }, {
                        text: "2.5 元组",
                        link: "basic-data-type/tuple",
                    }, {
                        text: "2.6 集合",
                        link: "basic-data-type/set",
                    }, {
                        text: "2.7 字典",
                        link: "basic-data-type/dict",
                    }
                ],
                collapsible: true,
                expanded: false,
            },]
    }
);
