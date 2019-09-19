# Astroboy

Astroboy（阿童木）is a Nodejs SFB(Separation of Front and Back ends) framework, built on koa2.

[![npm version](https://badge.fury.io/js/astroboy.svg)](https://badge.fury.io/js/astroboy)

## Install

```zsh
yarn add astroboy
```

## Run app with node

### 1. Compile project

```zsh
tsc && cp config app/config
```

### 2. Start app.js

```zsh
cd dist && node app/app.js
```

## Run app with ts-node

### 1. install ts-node and typescript

```zsh
yarn add typescript ts-node
```

### 2. Start app

```zsh
npx ts-node app/app.ts
```

## Run app in development mode

- use [astroboy-cli](https://www.npmjs.com/package/astroboy-cli) for js or js/ts hybrid project
- use [@exoskeleton/cli](https://www.npmjs.com/package/@exoskeleton/cli) for typescript-only project

## More details

> For more details, please refer to [https://astroboy-lab.github.io/astroboy](https://astroboy-lab.github.io/astroboy)
