
## Controller

### 1. Controller 层代码推荐写法

* 第一步：接收请求参数
* 第二步：请求参数校验
* 第三步：调用 Service 层提供的方法
* 第四步：Service 接口数据拼装 / setGlobal / setState
* 第五步：返回结果，可能是渲染一个页面或者返回一个 JSON 格式的数据

示例代码：

```javascript
const BaseController = require('../base/BaseController');

class ShopController extends BaseController {
  async getShopCopyrightSettingsJson(ctx) {
    const kdtId = ctx.kdtId;
    this.validator
      .required(kdtId, '参数 kdt_id 不能为空');
    const result = await this.callService(
      'iron-base/shop.ShopSettingsService',
      'getShopCopyrightSettings',
      kdtId);

    ctx.r(0, 'ok', result);
  }
}
module.exports = ShopController;
```

### 2. 一些约定

* 文件名命名约定：文件名按照 Controller 类名命名，例如 Controller 类叫 IndexController，那么相应的文件名就叫 IndexController.js
* 每个应用都应该有一个 BaseController，一般约定存放在 `controllers/base`目录，应用的 BaseController 继承上层框架的 BaseController，最上层的 Controller  继承框架 Astroboy 的 BaseClass
* Controller 构造函数第一个参数必须是 ctx 对象

### 3. Controller 层如何调用 Service 层提供的服务接口

#### （1）最常见的用法

手动引入 Service Class 文件，然后在方法执行的时候，先初始化 Service Class，然后调用 Service 提供的接口。

代码示例：

```javascript
const BaseController = require('../base/BaseController');
const ShopSettingsService = require('../../services/shop/ShopSettingsService');

class ShopController extends BaseController {
  async getShopCopyrightSettingsJson(ctx) {
    const kdtId = ctx.kdtId;
    this.validator
      .required(kdtId, '参数 kdt_id 不能为空');
    const result = await new ShopSettingsService(ctx).getShopCopyrightSettings(kdtId);

    ctx.r(0, 'ok', result);
  }
}
module.exports = ShopController;
```

#### （2）callService(service, method, ...args)

该方法一般适用于调用上层业务框架提供的服务

* service：服务，规则 `${包名}/${服务名}`，例如：`iron-base/shop.ShopSettingsService`
* method：方法名，例如 `getShopCopyrightSettings`
* args：参数，可以有多个

示例：

```javascript
const data = await this.callService('iron-base/shop.ShopSettingsService', 'getShopCopyrightSettings', kdtId);
```

提示：可通过 `run/services.json` 文件查看应用提供的所有 Service，`services.json`文件是类似下面这样。

```json
{
  "youzan-framework": [
    "base.YouzanBaseService"
  ],
  "iron-base": [
    "channels.MpAccountService",
    "common.WhitelistService",
    "ic.ItemGroupService",
    "ic.ItemQueryService"
  ],
  "wsc-h5-v3": [
    "base.BaseService",
    "shop.ShopExtendReadService",
    "sms.SmsCaptchaService",
    "user.UserInfoService"
  ]
}
```


#### （3）getServiceClass(packageName, serviceName)

获取一个 Service 类，该方法适用于业务需要手动初始化 Service 类实例的场景。

参数说明：

* packageName：包名，或者说是 Service 类命名空间
* serviceName：服务名，例如：`shop.ShopSettingsService`

代码示例：

```javascript
const BaseController = require('../base/BaseController');

class ShopController extends BaseController {
  async getShopCopyrightSettingsJson(ctx) {
    const kdtId = ctx.kdtId;
    this.validator
      .required(kdtId, '参数 kdt_id 不能为空');
    const ShopSettingsService = this.getServiceClass('iron-base', 'shop.ShopSettingsService');
    const result = await new ShopSettingsService(ctx).getShopCopyrightSettings(kdtId);

    ctx.r(0, 'ok', result);
  }
}
module.exports = ShopController;
```

**注意：** 初始化一个 Service 的时候，第一个参数必须为 ctx

#### （4）getService(packageName, serviceName)

获取一个 Service 类实例，该方法会帮你初始化好 Service 类实例，并返回该实例。

代码示例：

```javascript
const BaseController = require('../base/BaseController');

class ShopController extends BaseController {
  async getShopCopyrightSettingsJson(ctx) {
    const kdtId = ctx.kdtId;
    this.validator
      .required(kdtId, '参数 kdt_id 不能为空');
    const shopSettingsService = this.getServiceClass('iron-base', 'shop.ShopSettingsService');
    const result = await shopSettingsService.getShopCopyrightSettings(kdtId);

    ctx.r(0, 'ok', result);
  }
}
module.exports = ShopController;
```