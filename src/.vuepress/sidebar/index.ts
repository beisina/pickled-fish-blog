import {sidebar} from "vuepress-theme-hope";

export default sidebar({
        "/": [
            "",
            {
                text: "python",
                icon: "fa-brands fa-python",
                prefix: "python",
                collapsible: true,
                expanded: false,
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
                    {
                        text: "函数",
                        icon: "fa-solid fa-f",
                        prefix: "function/",
                        collapsible: true,
                        expanded: false,
                        children: [
                            "function-and-variable-transfer",
                            "higher-order-function",
                            "decorator"
                        ]
                    },
                ]
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
            },
            {
                text: "中间件",
                icon: "/assets/icon/middleware.svg",
                prefix: "database",
                children: []
            },
            {
                text: "Linux",
                icon: "fa-brands fa-linux",
                prefix: "kubernetes",
                children: []
            },
            {
                text: "docker",
                icon: "fa-brands fa-docker",
                prefix: "kubernetes",
                children: []
            },
            {
                text: "kubernetes",
                icon: "/assets/icon/kubernetes.svg",
                prefix: "kubernetes",
                collapsible: true,
                expanded: false,
                children: [
                    {
                        text: "部署文档",
                        prefix: "deployment/",
                        collapsible: true,
                        expanded: false,
                        children: [
                            "kubernetes-1-23-cluster-setup",
                            "kubernetes-1-28-cluster-setup"
                        ]
                    },
                ]
            },
        ]
    }
);
