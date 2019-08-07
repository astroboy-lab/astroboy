### TypeScript 版本框架设计

Astroboy 的 1.1.0+ 版本针对 TypeScript 进行了一次重新设计，优化了框架定义体系，全面支持 TypeScript 语言开发环境。

#### 重新设计框架定义

为了支持无限定义扩展，Astroboy 新版重新设计了针对 TS 的框架申明，使用可配置升级的接口来自定义 Astroboy 各个部分的静态语义。

> 框架定义体系部分源代码

```typescript
export interface IBaseContextDefine {
  ctx: any;
  app: any;
  config: any;
  services: any;
  controllers: any;
  libs: any;
}
```

`IBaseContextDefine` 定义了整个 Astroboy 框架各个部分的基础类型 any，使用 `any` 的好处是作为底层接口可以更好的适配上层扩展，实现接口收拢的需求。

比如：

```typescript
export interface IBaseApplication<F extends any = {}> extends Koa {
  config: F;
}

export interface IBaseContext<F extends any = {}, A extends IBaseApplication = IBaseApplication<F>>
  extends Koa.Context {
  app: A;
  config: F;
  request: Koa.Request & {
    body: any;
  };
}

/**
 * ## astroboy 基础上下文扩展结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyContextDefine
 * @extends {IBaseContextDefine}
 */
export interface IAstroboyContextDefine extends IBaseContextDefine {
  ctx: IBaseContext<{}>;
  app: IBaseApplication<{}>;
  config: {};
  services: {};
  controllers: {};
  libs: {};
}
```

通过继承基础接口，使得部分定义范围得以收窄，更好的描述应用程序而又不破坏底层框架扩展性。

框架定义在 Astroboy 中的存在感非常强烈，几乎所有的地方（诸如 service、controller、ctx 等等地方）都会被用到来约定成员的类型。

参考一下 BaseClass 的源代码：

```typescript
export class BaseClass<DEFINE extends Partial<IBaseContextDefine> = IAstroboyContextDefine>
  implements IAstroboyCtxExtends<DEFINE> {
  protected app: DEFINE['app'];
  protected config: DEFINE['config'];
  protected ctx: DEFINE['ctx'];

  constructor(ctx: DEFINE['ctx']) {
    this.ctx = <any>ctx;
    this.app = <any>(ctx && ctx.app);
    this.config = <any>(ctx && ctx.app && ctx.app.config);
  }

  // ...
}
```

在框架定义中定一个各个部件的定义会被标注到 `BaseClass` 的各个部分，所有基予 `BaseClass` 的 service 或者 controller 都可以完整地访问到 `ctx`、`app` 和 `config` 的类型声明。

#### 从 Astroboy 引入接口

Astroboy 的框架定义都被维护在"astroboy/definitions"目录下：

```text
.
├── extends                   # 框架扩展部分（对koa原生对象做的字段扩展）
├   ├── app.ts                # 对koa/app部分做的扩展
├   └── context.ts            # 对koa/ctx部分做的扩展
├── plugins                   # Astroboy插件的定义导出
├   └── index.ts              # Astroboy插件的合并定义导出（单个插件定义在app/plugins文件夹内）
├── base.ts                   # 基础框架契约
├── config.ts                 # 配置相关的约定
├── core.ts                   # 框架核心接口定义
└── index.ts                  # 导出模块出口
```

框架主要部件的定义速览：

> import { ... } from "astroboy/definitions";

```typescript
/**
 * astroboy 框架的配置参数
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyBootstrapOptions
 * @extends {BootstrapOptions}
 */
export interface IAstroboyBootstrapOptions extends BootstrapOptions {}

/**
 * ## astroboy 基础上下文扩展结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyContextDefine
 * @extends {IBaseContextDefine}
 */
export interface IAstroboyContextDefine extends IBaseContextDefine {
  ctx: IBaseContext;
  app: IAstroboyApplication;
  config: PureObject;
  services: {};
  controllers: {};
  libs: {};
}

/**
 * ## astroboy 基础app结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyApplication
 * @extends {IAstroboyPluginAppMixins}
 * @extends {IAstroboyAppExtends<CONFIG>}
 * @template CONFIG
 */
export interface IAstroboyApplication<CONFIG extends PureObject = PureObject>
  extends IAstroboyPluginAppMixins,
    IPureAstroboyApplication<CONFIG> {}

/**
 * astroboy 基础Ctx结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyContext
 * @extends {IAstroboyPluginCtxMixins}
 * @extends {IAstroboyCtxExtends<CONFIG, A>}
 * @template CONFIG
 * @template APP
 */
export interface IAstroboyContext<DEFINE extends Partial<IBaseContextDefine> = IAstroboyContextDefine>
  extends IAstroboyPluginCtxMixins,
    IPureAstroboyContext<DEFINE> {}

/**
 * astroboy 基础configs结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyConfigs
 * @extends {IAstroboyPluginConfigMixins}
 * @extends {IBaseProjectConfig}
 */
export interface IAstroboyConfigs extends IAstroboyPluginConfigMixins, IBaseProjectConfig {}

/**
 * astroboy 基础plugins结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyPlugins
 * @extends {IAstroboyPluginRegisterMixins}
 * @extends {IBasePluginConfig}
 */
export interface IAstroboyPlugins extends IAstroboyPluginRegisterMixins, IBasePluginConfig {}

/**
 * astroboy 基础middlewares结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyMiddlewares
 * @extends {IAstroboyPluginMiddlewareMixins}
 * @extends {IBaseMiddlewareConfig}
 */
export interface IAstroboyMiddlewares extends IAstroboyPluginMiddlewareMixins, IBaseMiddlewareConfig {}
```

按图索骥吧 😄！
