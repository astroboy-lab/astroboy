## Service

### 一些约定

* 文件名命名约定：文件名按照 Service 类命名，例如 Service 类叫 IndexService，那么文件名就叫 IndexService.js ，Service 类的命名参照后端服务命名。
* 每个应用都应该有一个 BaseService，应用的 BaseService 继承上层框架的 BaseService，最上层的 Service  继承框架 Astroboy 的 BaseClass
* Service 构造函数第一个参数必须是 ctx 对象

