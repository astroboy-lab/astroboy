## astroboy-cli 工具介绍

### 1. astroboy-cli 工具是用来做什么的？

astroboy-cli 是 Astroboy 框架提供的一个用于本地开发调试的命令行工具。

### 2. 安装

```
npm install -g astroboy-cli
```

### 3. 命令介绍

#### ast dev 本地开发调试命令

```
    Usage: dev [options]

  本地开发，开启后端服务

  Options:

    --debug [debugName]    开启 debug 模式
    --env [NODE_ENV]       设置 NODE_ENV 环境变量，默认 development
    --port [NODE_PORT]     设置 NODE_PORT 环境变量，默认 8201
    --mock [proxyUrl]      开启 mock 模式，默认 proxy 地址为 http://127.0.0.1:8001
    --ts [open]            开启 ts-node 模式
    --tsconfig [config]    使用自定义的ts编译配置文件
    --inspect [inspect]    启用inspector，开启编辑器断点调试
    --watch [watchDirs]    指定额外的监听目录
    --ignore [ignoreDirs]  指定忽略监听的目录
    -h, --help             output usage information

  Examples:

    $ ast dev
    $ ast dev --debug
    $ ast dev --debug koa:application
    $ ast dev --debug --mock
    $ ast dev --mock http://127.0.0.1:8001
    $ ast dev --mock
    $ ast dev --env pre
    $ ast dev --port 8201
    $ ast dev --env qa --port 8201
    $ ast dev --ts
    $ ast dev --ts --tsconfig app/tsconfig.json
    $ ast dev --ts --inspect
    $ ast dev --watch definitions
    $ ast dev --ignore definitions
```

#### ast build TS 编译命令

```
  Usage: build [options]

  编译 Typescript 文件

  Options:

    -h, --help  output usage information

  Examples:

    $ ast build
```

#### ast convertRouter 升级路由配置到 V2 版本

```
Usage: convertRouter [options]

  升级路由配置到 V2 版本

  Options:

    --dir [dir]  指定路由文件目录，默认 app/routers
    -h, --help   output usage information

  Examples:

    $ ast convertRouter
    $ ast convertRouter --dir ./app/routers
```
