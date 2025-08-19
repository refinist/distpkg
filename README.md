# dist-pkg-creator

一个用于处理 `distpkg` 配置的工具。它专注于读取配置文件并生成相应的文件，让用户通过 npm scripts 来组合构建和配置处理的流程。

## 功能特性

- 📦 处理 `distpkg` 配置
- ⚙️ 支持配置文件自定义
- 🎯 简单专注的设计
- 📁 可配置输出目录和工作目录
- 📄 自动生成 package.json 文件
- ✅ 验证输出目录状态

## 安装

```bash
npm install -g dist-pkg-creator
# 或者
pnpm add -g dist-pkg-creator
# 或者
yarn global add dist-pkg-creator
```

## 使用方法

### 基本用法

```bash
# 处理 distpkg 配置
distpkg

# 指定输出目录
distpkg --out-dir build

# 指定工作目录
distpkg --cwd /path/to/project
```

### 命令行选项

```bash
distpkg [options]

选项:
  -c, --config <filename>     使用自定义配置文件
  -d, --out-dir <dir>        输出目录 (默认: "dist")
  --cwd <dir>                工作目录
  -h, --help                 显示帮助信息
  -v, --version              显示版本信息
```

## 配置文件

创建 `distpkg.config.ts` 文件来自定义配置：

```typescript
import { defineConfig } from 'dist-pkg-creator';

export default defineConfig({
  // 输出目录
  outDir: 'dist',

  // 工作目录
  cwd: process.cwd(),

  // package.json 配置
  packageJson: {
    name: 'my-package',
    version: '1.0.0',
    dependencies: {
      'some-dependency': '^1.0.0'
    },
    devDependencies: {
      typescript: '^5.0.0'
    }
  }
});
```

## 配置优先级

配置的优先级从高到低：

1. 命令行选项
2. 配置文件 (`distpkg.config.ts`)
3. 默认配置

## 使用场景

### 1. 通过 npm scripts 组合命令

在 `package.json` 中定义组合脚本：

```json
{
  "scripts": {
    "build": "tsdown",
    "distpkg": "distpkg",
    "build:distpkg": "npm run build && npm run distpkg"
  }
}
```

然后运行：

```bash
# 构建后处理 distpkg 配置
npm run build:distpkg
```

### 2. 在 CI/CD 流程中使用

```bash
# 构建项目
npm run build

# 处理 distpkg 配置并生成文件
distpkg --out-dir dist
```

### 3. 开发环境

```bash
# 开发时处理配置
distpkg

# 测试配置
distpkg --config test.config.ts
```

## 生成的文件

工具会根据配置文件中的 `packageJson` 选项，在输出目录中生成 `package.json` 文件。如果输出目录不存在，工具会自动创建。

## 项目结构

```
dist-pkg-creator/
├── src/
│   ├── cli.ts          # CLI 入口
│   ├── config.ts       # 配置处理
│   ├── index.ts        # 核心逻辑
│   ├── run.ts          # 可执行入口
│   └── types.ts        # 类型定义
├── distpkg.config.ts   # 配置文件
├── package.json
└── README.md
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 运行测试
pnpm run test

# 类型检查
pnpm run typecheck
```

## 许可证

MIT
