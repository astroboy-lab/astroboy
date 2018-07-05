import Koa from 'koa'
import { EventEmitter } from 'events'

interface Constructor<T> {
    new(...args: any[]): T
}

// Loader 部分不对外暴露 无注释
interface LoaderOptions {
    baseDir: string
    astroboy: Astroboy
    app: App
}

interface LoaderDefaultPatterns {
    application: string
    context: string
    request: string
    response: string
    controller: string
    service: string
    router: string
    middleware: string
    lib: string
    config: string[]
    middlewareConfig: string[]
    pluginConfig: string[]
}

interface LoaderPatterns extends LoaderDefaultPatterns {
    [key: string]: any
}

interface LoaderDir {
    baseDir: string
    type: string
    name: string
}

declare class CoreLoader {
    readonly defaultPatterns: LoaderDefaultPatterns
    options: LoaderOptions
    baseDir: string
    astroboy: Astroboy
    app: App
    NODE_ENV: string
    patterns: LoaderPatterns
    dirs: LoaderDir[]

    constructor()

    public init(): void
    public loadPkg(): void
    public loadDirs(baseDir: string): void
    public getPluginDirs(): void
    public getPluginPath(): void
    public getPluginConfig(): void
    public globItem(): void
    public globDirs(): void
    public loadExtend(): void
    public loadConfig(): void
    public loadMiddlewareConfig(): void
    public loadMiddlewares(): void
    public loadMiddlewareQueue(): void
    public loadLib(): void
    public loadBoot(): void
}

declare class DefaultLoader extends CoreLoader {
    constructor(options: LoaderOptions)

    public init(): void
    public loadControllers(): void
    public loadServices(): void
    public loadRouters(): void
    public loadVersionFiles(): void
    public useMiddlewares(): void
    public wrapMiddleware(): void
}

/**
 * @description 模板设置
 * @interface ViewConfig
 */
interface ViewConfig {
    root?: string[]
    mapping?: { [key: string]: any }
    cache?: boolean
    defaultExtension?: string
    [key: string]: any
}

/**
 * @description 阿童木 config 字典
 */
interface Config {
    view: ViewConfig
    [key: string]: any
}

/**
 * @description 阿童木 services 构造函数字典
 */
interface Services {
    [key: string]: Service
}

/**
 * @description 阿童木具体 service 构造函数
 */
interface Service {
    [key: string]: Constructor<any>
}

/**
 * @description 阿童木 controllers 构造函数字典
 */
interface Controllers {
    [key: string]: Controller
}

/**
 * @description 阿童木具体 controller 构造函数
 */
interface Controller {
    [key: string]: Constructor<any>
}

/**
 * @description 阿童木 router 结构化字典
 */
type Router = (string | string[])[][]

/**
 * @description 阿童木 versionMap 静态文件字典(打包相关)
 */
interface VersionMap {
    [key: string]: Version
}

/**
 * @description 阿童木具体某种文件字典(css / js)
 */
interface Version {
    [key: string]: string
}

/**
 * @description 阿童木具体 service 实例
 */
interface ServiceInstance {
    [key: string]: () => Promise<any>
}

/**
 * @description 阿童木公共 libs 字典
 */
interface Libs {
    [key: string]: Lib
}

/**
 * @description 阿童木具体 lib 字典
 */
interface Lib {
    [key: string]: any
}

/**
 * @description 阿童木中间件配置字典
 */
interface MiddlewareConfig {
    priority?: number
    enable?: boolean
    options?: {
        root?: string
        [prop: string]: any
    }
    name?: string
}

declare const RENDER: unique symbol;
declare const RENDER_STRING: unique symbol;

declare class ContextView {
    ctx: Context
    app: App
    viewManager: ViewManager
    config: ViewConfig

    constructor(ctx: Context)

    render(...args: any[]): Promise<any>

    [RENDER](): Promise<any>
    [RENDER_STRING](): ViewEngine
}

/**
 * @description 阿童木 ctx 接口
 */
interface Context extends Koa.Context {
    // astroboy-view
    readonly view: ContextView

    /**
     * @description 渲染模版文件 异步
     * @param {...any[]} args
     * @returns {Promise<any>}
     * @memberof Context
     */
    render(...args: any[]): Promise<any>
    renderView(...args: any[]): Promise<any>

    // core-loader 注入
    /**
     * @description 获取应用 config 字典
     * @returns {Config} 完整 config 字典
     * @memberof Context
     */
    getConfig(): Config

    /**
     * @description 获取具体某个 config
     * @param {string} key
     * @returns {*} config[key]
     * @memberof Context
     */
    getConfig(key: string): any

    /**
     * @description 获取某个具体 lib 包
     * @param {string} packageName
     * @param {string} libName
     * @returns {Lib} lib 字典
     * @memberof Context
     */
    getLib(packageName: string, libName: string): Lib

    /**
     * @description 获取某个 service 构造函数
     * @param {string} packageName
     * @param {string} serviceName
     * @returns {Service}
     * @memberof Context
     */
    getServiceClass(packageName: string, serviceName: string): Service

    /**
     * @description 获取某个具体的 service 实例(以 ctx 为唯一参数)
     * @param {string} packageName
     * @param {string} serviceName
     * @returns {ServiceInstance}
     * @memberof Context
     */
    getService(packageName: string, serviceName: string): ServiceInstance

    /**
     * @description 调用具体某个 service 上某个具体方法, 默认异步
     * @param {string} service
     * @param {string} method
     * @param {...any[]} args
     * @returns {Promise<any>}
     * @memberof Context
     */
    callService(service: string, method: string, ...args: any[]): Promise<any>
}

interface ViewEngine {
    render(...args: any[]): any
    renderString(...args: any[]): any
    [key: string]: any
}

declare class ViewManager extends Map {
    config: ViewConfig
    extMap: Map<string, any>
    fileMap: Map<string, any>

    /**
     * @description 注册模板引擎(构造函数)
     * @param {*} name
     * @param {*} viewEngine
     * @memberof ViewManager
     */
    use(name: string, viewEngine: Constructor<ViewEngine>): void

    /**
     * @description 读取模板文件相对路径(相对 root)+文件名+后缀
     * @param {string} name
     * @returns {string}
     * @memberof ViewManager
     */
    resolve(name: string): string

    /**
     * @description 遍历 names, 定位文件相对路径后返回
     * @author fancy
     * @param {string[]} names
     * @param {string} root
     * @returns {string}
     * @memberof ViewManager
     */
    resolvePath(names: string[], root: string): string
}

interface App extends Koa {
    context: Context
    env: string
    NODE_ENV: string
    ROOT_PATH: string
    ROOT_NAME: string
    APP_EXTENSIONS: ['js'] | ['js', 'ts']

    // astroboy-view 注入
    readonly view: ViewManager

    // default-loader 注入
    /**
     * @description 应用 services 集合字典
     * @type {Services}
     * @memberof App
     */
    services: Services

    /**
     * @description 应用 controllers 集合字典
     * @type {Controllers}
     * @memberof App
     */
    controllers: Controllers

    /**
     * @description 应用 router 结构化字典
     * @type {Router}
     * @memberof App
     */
    router: Router

    /**
     * @description 应用静态文件字典
     * @type {VersionMap}
     * @memberof App
     */
    versionMap: VersionMap

    // core-loader 注入
    pkg: any
    libs: Libs
    config: Config
    middlewares: Koa.Middleware[]
    middlewareConfig: { [key: string]: MiddlewareConfig }
    middlewareQueue: MiddlewareConfig[]

    /**
     * @description 获取应用 config 字典
     * @returns {Config} 完整 config 字典
     * @memberof App
     */
    getConfig(): Config

    /**
     * @description 获取具体某个 config
     * @param {string} key
     * @returns {*} config[key]
     * @memberof App
     */
    getConfig(key: string): any

    /**
     * @description 获取某个 service 构造函数
     * @param {string} packageName
     * @param {string} serviceName
     * @returns {Service}
     * @memberof App
     */
    getServiceClass(packageName: string, serviceName: string): Service

    /**
     * @description 获取某个具体 lib 包
     * @param {string} packageName
     * @param {string} libName
     * @returns {Lib} lib 字典
     * @memberof App
     */
    getLib(packageName: string, libName: string): Lib
}

interface Options {
    NODE_ENV: string
    NODE_PORT: string
    ROOT_PATH: string
    APP_EXTENSIONS: ['js'] | ['js', 'ts']
}

type OptionParms = Partial<Options>;

declare const BASE_DIR: unique symbol

interface Response extends Koa.Response { }

interface Request extends Koa.Request { }

interface BaseClassContract {
    ctx: Context
    app: App
    config: Config

    /**
     * @description 获取应用 config 字典
     * @returns {Config} 完整 config 字典
     * @memberof BaseClassContract
     */
    getConfig(): Config

    /**
     * @description 获取具体某个 config
     * @param {string} key
     * @returns {*} config[key]
     * @memberof BaseClass
     */
    getConfig(key: string): any

    /**
     * @description 获取某个 service 构造函数
     * @param {string} packageName
     * @param {string} serviceName
     * @returns {Service}
     * @memberof BaseClassContract
     */
    getServiceClass(packageName: string, serviceName: string): Service

    /**
     * @description 获取某个具体 lib 包
     * @param {string} packageName
     * @param {string} libName
     * @returns {Lib} lib 字典
     * @memberof BaseClassContract
     */
    getLib(packageName: string, libName: string): Lib

    /**
     * @description 获取具体 service 的实例
     * @param {string} packageName
     * @param {string} serviceName
     * @returns {ServiceInstance}
     * @memberof BaseClassContract
     */
    getService(packageName: string, serviceName: string): ServiceInstance

    /**
     * @description 调用具体某个 service 上某个具体方法 默认异步
     * @author fancy
     * @param {string} service
     * @param {string} method
     * @param {...any[]} args
     * @returns {Promise<any>}
     * @memberof BaseClassContract
     */
    callService(service: string, method: string, ...args: any[]): Promise<any>
}

declare global {
    type SourceType<T> = {
        [key in keyof T]: T[key];
    }
    interface AstroboyConfig extends Config { }
    interface AstroboyServices extends Services { }
    interface AstroboyService extends Service { }
    interface AstroboyServiceInstance extends ServiceInstance { }
    interface AstroboyControllers extends Controllers { }
    interface AstroboyAstController extends Controller { }
    interface AstroboyRouter extends Router { }
    interface AstroboyVersionMap extends VersionMap { }
    interface AstroboyVersion extends Version { }
    interface AstroboyMiddlewareConfig extends MiddlewareConfig { }
    interface AstroboyLibs extends Libs { }
    interface AstroboyLib extends Lib { }
    interface AstroboyApp extends App { }
    interface AstroboyContext extends Context { }
    interface AstroboyRequest extends Request { }
    interface AstroboyResponse extends Response { }
}

declare class Astroboy extends EventEmitter {
    readonly [BASE_DIR]: string

    options: Options
    app: AstroboyApp
    loader: DefaultLoader

    constructor(options?: OptionParms)

    public init(): void
    public start(): void
}

declare namespace Astroboy {
    class BaseClass implements BaseClassContract {
        ctx: AstroboyContext
        app: AstroboyApp
        config: AstroboyConfig

        constructor(ctx: AstroboyContext)

        getConfig(): AstroboyConfig
        getConfig(key: string): any
        getLib(packageName: string, libName: string): AstroboyLib
        getServiceClass(packageName: string, serviceName: string): AstroboyService
        getService(packageName: string, serviceName: string): AstroboyServiceInstance
        callService(service: string, method: string, ...args: any[]): any
    }

    export const Controller: typeof BaseClass
    export const Service: typeof BaseClass
}

export = Astroboy