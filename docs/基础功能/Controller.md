## Controller

### 1. Controller 介绍

控制器负责解析用户的输入，处理后返回响应的结果，一般按照这样的方式去写

- 第一步：接收请求参数
- 第二步：请求参数校验
- 第三步：调用 Service 层提供的方法
- 第四步：Service 接口数据拼装 / setGlobal / setState
- 第五步：返回结果，可能是渲染一个页面或者返回一个 JSON 格式的数据

示例代码：

```javascript
const BaseController = require('../base/BaseController');
const ShopSettingsService = require('../../services/shop/ShopSettingsService');

class ShopController extends BaseController {
  async getShopSettingsJson(ctx) {
    const shopId = ctx.shopId;
    this.validator.required(shopId, '参数 shopId 不能为空');
    const result = await new ShopSettingsService(ctx).getShopSettings(shopId);

    ctx.r(0, 'ok', result);
  }
}
module.exports = ShopController;
```

### 2. 一些约定

- 文件名命名约定：文件名按照 Controller 类名命名，例如 Controller 类叫 IndexController，那么相应的文件名就叫 IndexController.js
- 每个应用都应该有一个 BaseController，一般约定存放在 `controllers/base`目录，应用的 BaseController 继承上层框架的 BaseController，最上层的 Controller 继承框架 Astroboy 的 BaseClass
- Controller 构造函数第一个参数必须是 ctx 对象
