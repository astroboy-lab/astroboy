
## astroboy-cli 工具介绍

### 1. astroboy-cli 工具是用来做什么的？



### 2. 安装

```
npm install -g astroboy-cli
```

### 3. 命令介绍

#### ast dev


ast dev --help

```
  Usage: dev [options]

  本地开发，开启后端服务

  Options:

    --debug [debugName]  开启 debug 模式
    --env [NODE_ENV]     设置 NODE_ENV 环境变量，默认 development
    --port [NODE_PORT]   设置 NODE_PORT 环境变量，默认 8201
    --mock [proxyUrl]    开启 mock 模式，默认 proxy 地址为 http://127.0.0.1:8001
    -h, --help           output usage information

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
```

