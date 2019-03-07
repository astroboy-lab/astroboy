## Router

框架约定了 `app/routers` 目录用来存放所有的路由配置文件，将路由配置文件统一存放，这样可以避免路由规则配置散落在多个地方。

### Router 如何定义

每个路由文件其实都是一张路由注册表，在应用启动后，会合并所有的路由注册表，并且存放到应用内存中。

示例代码：

```
// app/routers/default.js
module.exports = [
  ['INDEX_PAGE', 'GET', ['/', '/index'], 'index.IndexController', 'getIndexHtml'],
  ['ABOUT_PAGE', 'GET', '/about', 'index.IndexController', 'getAboutHtml']
];
```

* 第一个参数：可选，路由名，默认为空，大部分情况不需要设置，方便其他使用该路由。
* 第二个参数：必传，HTTP Verb，支持 GET / PUT / POST / DELETE / HEAD / OPTIONS / PATCH，不区分大小写，特殊值 ALL ，匹配所有请求
* 第三个参数：必传，匹配路由，如果需要匹配多个路径，可传入一个数组，每个路由支持字符串、正则、通配符。
* 第四个参数：必传，路由文件，规则：${目录名}.${目录名}.${文件名}（注意：目录名可能有多个）
* 第五个参数：必传，字符串或一个数组，分别代表执行的一个方法或一组方法。

### 关于 Router 的一些约定

* 路由名命名规则：小写英文字母 + 下划线
* JSON接口路由声明必须以 `.json` 结尾
* 页面请求路由声明没有后缀

### 如何控制路由文件加载顺序

默认情况下，在应用启动后，框架会去遍历 `app/routers` 目录下的所有文件，并且按照文件在目录中的顺序加载。但是在一些特殊场景下，比如单页应用，我们可能就需要控制路由文件的加载顺序，那么，在 `app/routers` 目录下就需要先定义一个 `index.js` 文件，通过这个文件来手动控制路由注册顺序，如下代码所示。

```
module.exports = [
  ...require('./default'),
  ...require('./common')
];
```

**注意**：一旦 `app/routers` 目录存在 `index.js` 文件，框架就只会加载改文件。

### 真实业务场景实例

简单业务场景，例如 Restful JSON 接口：

```js
['GET', '/wscshop/showcase/shopnav/nav.json', 'showcase.ShopNavController', 'getShopNavJson'],
```

复杂业务场景，例如下面的店铺主页：

```js
['GET', '/wscshop/home/:alias', 'showcase.HomepageController', [
  'checkVipDomain',
  'initKdtId',
  'initHomepageDetailData',
  'initPlatform',
  'initAcl',
  'initBaseInfo',
  'getIndexHtml'
]]
```

### 如何查看完整的路由注册表

应用启动后，框架会对 `app/routers` 目录下的所有文件做一个合并，并且把合并后的路由注册表输出到 `run/routers.json` 文件。