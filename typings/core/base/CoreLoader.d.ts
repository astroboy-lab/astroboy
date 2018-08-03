/// <reference path="../../index.d.ts" />
import Astroboy, { App } from "astroboy";

interface LoaderDefaultPatterns {
    application: string;
    context: string;
    request: string;
    response: string;
    controller: string;
    service: string;
    router: string;
    middleware: string;
    lib: string;
    config: string[];
    middlewareConfig: string[];
    pluginConfig: string[];
}

interface LoaderPatterns extends LoaderDefaultPatterns {
    [key: string]: any;
}

export interface LoaderOptions {
    baseDir: string;
    astroboy: Astroboy;
    app: App;
}

interface LoaderDir {
    baseDir: string;
    type: string;
    name: string;
}

declare class CoreLoader {
    readonly defaultPatterns: LoaderDefaultPatterns;
    options: LoaderOptions;
    baseDir: string;
    astroboy: Astroboy;
    app: App;
    NODE_ENV: string;
    patterns: LoaderPatterns;
    dirs: LoaderDir[];

    constructor();

    protected init(): void;
    protected loadPkg(): void;
    protected loadDirs(baseDir: string): void;
    protected getPluginDirs(): void;
    protected getPluginPath(): void;
    protected getPluginConfig(): void;
    protected globItem(): void;
    protected globDirs(): void;
    protected loadExtend(): void;
    protected loadConfig(): void;
    protected loadMiddlewareConfig(): void;
    protected loadMiddlewares(): void;
    protected loadMiddlewareQueue(): void;
    protected loadLib(): void;
    protected loadBoot(): void;
}

export default CoreLoader;
