# distpkg

[![npm](https://img.shields.io/npm/v/distpkg.svg?colorA=f9f0e1&colorB=000000)](https://npmjs.com/package/distpkg) [![Unit Test](https://img.shields.io/github/actions/workflow/status/refinist/distpkg/unit-test.yml?colorA=f9f0e1&colorB=000000&label=Unit%20Test)](https://github.com/refinist/distpkg/actions/workflows/unit-test.yml) [![codecov](https://img.shields.io/codecov/c/github/refinist/distpkg?colorA=f9f0e1&colorB=000000)](https://codecov.io/github/refinist/distpkg)

A post-build tool for projects (commonly used after bundling with <img src="https://private-user-images.githubusercontent.com/6010774/382552750-50282090-adfd-4ddb-9e27-c30753c6b161.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY4MTAxNTAsIm5iZiI6MTc1NjgwOTg1MCwicGF0aCI6Ii82MDEwNzc0LzM4MjU1Mjc1MC01MDI4MjA5MC1hZGZkLTRkZGItOWUyNy1jMzA3NTNjNmIxNjEucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkwMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MDJUMTA0NDEwWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZjAzZjU5ODg5N2YxZWE1MmY4MDk4MzJjNGUyZGFmY2EzYWM3ODVlZDlhYjg1MjgwZjY4ZDRkZDc2NDFiOTRhMyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.9HulMQMBjn2ri7MM2quH_2_DPZuRmH-eFKcKmnl0oX4" width="18" style="vertical-align: middle;" />(bun) or node, etc., after bundling into single files), generates minimal package.json in dist directory, ensuring code executes correctly through a secondary install in the dist directory.

[中文文档](./README.zh-CN.md)

## Why do we need to install again?

Because some packages may depend on the current environment, we extract these packages separately, such as foo, and put them in the dependencies of dist/package.json. This way, through a secondary install in the dist directory, we can ensure the code executes correctly!

## Why bundle? 🤨

[Why bundle?](https://bun.sh/docs/bundler#why-bundle), let's read this article together

## Features

- 🚀 **Fast and Simple**: Quickly generate dist/package.json
- 📦 **Flexible Configuration**: Support both CLI options and config files
- 🔧 **Customizable**: Choose which package.json fields to include
- 🌟 **TypeScript Support**: Full TypeScript support with type definitions
- 📝 **Auto Sorting**: Automatically sort package.json fields, perfect for OCD 😂
- ✅ **100% Test Coverage**: Project stability and reliability guaranteed
- <img src="https://private-user-images.githubusercontent.com/6010774/382552750-50282090-adfd-4ddb-9e27-c30753c6b161.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTY4MTAxNTAsIm5iZiI6MTc1NjgwOTg1MCwicGF0aCI6Ii82MDEwNzc0LzM4MjU1Mjc1MC01MDI4MjA5MC1hZGZkLTRkZGItOWUyNy1jMzA3NTNjNmIxNjEucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkwMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MDJUMTA0NDEwWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZjAzZjU5ODg5N2YxZWE1MmY4MDk4MzJjNGUyZGFmY2EzYWM3ODVlZDlhYjg1MjgwZjY4ZDRkZDc2NDFiOTRhMyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.9HulMQMBjn2ri7MM2quH_2_DPZuRmH-eFKcKmnl0oX4" width="18" style="vertical-align: middle;" /> **Bun Perfect Integration**: Optimized for Bun single-file bundling, seamless integration

## Installation

```bash

# pnpm
pnpm add -D distpkg

# bun
bun add -D distpkg

# npm
npm install -D distpkg

# yarn
yarn add -D distpkg
```

## Quick Start

### Basic Usage (Only 2 Steps)

1. Configure scripts in package.json

```json
{
  "scripts": {
    "build": "pnpm run build:project && distpkg",
    "build:project": "your build command"
  }
}
```

2. Configure distpkg.config.ts

```typescript
// distpkg.config.ts
import { defineConfig } from 'distpkg';

export default defineConfig({
  packageJson: {
    dependencies: {
      foo: '^1.0.0'
      /* more dependencies */
    }
  }
});
```

> [!TIP]
> When building your project, you should exclude the foo package, such as `"build": "bun build src/index.ts --target bun --outdir=dist --bytecode --minify --external foo"`

## CLI Options

```
Usage:
  $ distpkg [...package-keys]

Commands:
  [...package-keys]  Keys to copy from project package.json to dist/package.json

For more info, run any command with the `--help` flag:
  $ distpkg --help

Options:
  -c, --config <filename>  Use a custom config file
  -d, --out-dir <dir>      Output directory (default: dist)
  --cwd <dir>              Working directory (default: process.cwd())
  -s, --sort               Sort package.json (default: true)
  -h, --help               Display this message
  -v, --version            Display version number
```

### Programmatic Usage

```typescript
import { build } from 'distpkg';

// your build js
// ...
const result = await build({
  /* ... */
});
if (!result.success) {
  console.error('Build failed with errors:', result.message);
}
```

## Docker Deployment

With this tool, our project best practices should be as follows (personal opinion only):

install -> build -> cd dist -> install -> package into image -> deploy to docker -> deploy successfully and start service

## License

[MIT](./LICENSE)

Copyright (c) 2025-present, Zhifeng (Jeff) Wang
