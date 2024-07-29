import {sidebar} from "vuepress-theme-hope";

export default sidebar({
        "/": [
            "",
            {
                text: "python",
                icon: "fa-brands fa-python",
                prefix: "python",
                children: [
                    {
                        text: "基础",
                        icon: "fa-solid fa-layer-group",
                        prefix: "start/",
                        collapsible: true,
                        expanded: false,
                        children: [
                            "profile",
                            "environment-construction",
                        ]
                    },
                    {
                        text: "基本数据类型",
                        icon: "fa-solid fa-bars",
                        prefix: "basic-data-type/",
                        collapsible: true,
                        expanded: false,
                        children: [
                            "string",
                            "bool-and-numbers",
                            "operators-and-prioritization",
                            "list",
                            "tuple",
                            "set",
                            "dict",
                        ]
                    },
                    {
                        text: "控制语句",
                        icon: "fa-solid fa-bars-progress",
                        link: "statement"
                    },
                ],
                collapsible: true,
                expanded: false,
            },
            {
                text: "golang",
                icon: "fa-brands fa-golang",
                prefix: "golang",
                children: []
            },
            {
                text: "数据库",
                icon: "fa-solid fa-database",
                prefix: "database",
                children: []
            }
        ]
    }
);
