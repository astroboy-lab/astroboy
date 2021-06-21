(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{372:function(t,a,s){"use strict";s.r(a);var n=s(45),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"声明式路由"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#声明式路由"}},[t._v("#")]),t._v(" 声明式路由")]),t._v(" "),s("h3",{attrs:{id:"_1、声明式路由-vs-命令式路由"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1、声明式路由-vs-命令式路由"}},[t._v("#")]),t._v(" 1、声明式路由 VS 命令式路由")]),t._v(" "),s("p",[t._v("在介绍这两种路由方式之前，得先介绍一下 "),s("code",[t._v("声明式编程")]),t._v("，在维基百科中是这么定义的：")]),t._v(" "),s("blockquote",[s("p",[t._v("声明式编程（Declarative programming）是一种编程范式，与命令式编程相对立，它描述目标的性质，让计算机明白目标，而非流程。声明式编程不用告诉计算机问题领域，从而避免随之而来的副作用，而命令式编程则需要用算法来明确地指出每一步该怎么做。")])]),t._v(" "),s("h3",{attrs:{id:"_2、如何将老版本路由升级到声明式路由写法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2、如何将老版本路由升级到声明式路由写法"}},[t._v("#")]),t._v(" 2、如何将老版本路由升级到声明式路由写法？")]),t._v(" "),s("p",[s("code",[t._v("astroboy-cli")]),t._v(" 工具提供了一个命令 "),s("code",[t._v("ast convertRouter")]),t._v("，可以将老版本路由快速升级到新版本路由写法，如下所示：")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("  Usage: convertRouter "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("options"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n\n  升级路由配置到 V2 版本\n\n  Options:\n\n    --dir "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("dir"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("  指定路由文件目录，默认 app/routers\n    -h, --help   output usage information\n\n  Examples:\n\n    $ ast convertRouter\n    $ ast convertRouter --dir ./app/routers\n")])])]),s("h3",{attrs:{id:"_3、路由配置选项"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3、路由配置选项"}},[t._v("#")]),t._v(" 3、路由配置选项")]),t._v(" "),s("ul",[s("li",[t._v("name：接口名字，没有实质性作用，只用于接口元数据记录，例如：获取商品详情")]),t._v(" "),s("li",[t._v("description：接口描述，没有实质性作用，只用于接口元数据记录。")]),t._v(" "),s("li",[t._v("method：HTTP 请求方法，目前支持 "),s("code",[t._v("GET")]),t._v("、"),s("code",[t._v("HEAD")]),t._v("、"),s("code",[t._v("POST")]),t._v("、"),s("code",[t._v("PUT")]),t._v("、"),s("code",[t._v("DELETE")]),t._v("、"),s("code",[t._v("PATCH")]),t._v(" 以及 "),s("code",[t._v("OPTIONS")]),t._v("，它还可以是一个 HTTP 方法的数组")]),t._v(" "),s("li",[t._v("path：路由匹配 url 路径，还可以是一个 url 路径的数组")]),t._v(" "),s("li",[t._v("schema：用于验证请求的 schema 对象，必须符合 JSON Schema 格式，更多详细介绍请查看 "),s("a",{attrs:{href:"https://ajv.js.org/",target:"_blank",rel:"noopener noreferrer"}},[t._v("ajv"),s("OutboundLink")],1),t._v(" "),s("ul",[s("li",[t._v("body：当为 POST 或 PUT 方法时，校验请求主体。")]),t._v(" "),s("li",[t._v("query：校验 query，可以是一个完整的 JSON Schema 对象，它包括了值为 object 的 type 属性以及包含参数的 properties 对象，也可以仅仅是 properties 对象中的值 (见下文示例)。")]),t._v(" "),s("li",[t._v("header：校验 header 参数。")])])]),t._v(" "),s("li",[t._v("preHandler：前置处理请求的控制器实例方法名列表，例如：['adminAuth', 'apiAuth']")]),t._v(" "),s("li",[t._v("handler：处理请求的控制器类名及方法，中间通过 "),s("code",[t._v(":")]),t._v(" 分隔，例如："),s("code",[t._v("'index.IndexController:getIndexHtml'")])])]),t._v(" "),s("h4",{attrs:{id:"路由配置示例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#路由配置示例"}},[t._v("#")]),t._v(" 路由配置示例")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'关于页'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    description"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'这是关于页的详细描述'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    method"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'GET'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/about'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    preHandler"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'foo'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bar'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    handler"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'index.AboutController:getIndexHtml'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    schema"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      query"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        type"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'object'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        properties"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          name"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" type"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'string'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n          age"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" type"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'number'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        required"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'name'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=e.exports}}]);