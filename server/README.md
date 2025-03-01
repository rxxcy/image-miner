# 图片链接复制器 API 服务器

这是图片链接复制器 Chrome 扩展的后端 API 服务器，基于 Hono.js 构建。

## 功能

- 用户认证 API
- 图片管理 API
- RESTful 接口设计

## 技术栈

- Hono.js: 轻量级、现代化的 Web 框架
- TypeScript: 类型安全的 JavaScript 超集
- Node.js: JavaScript 运行时

## 开发

### 前提条件

- Node.js (推荐 v18+)
- pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 生产环境运行

```bash
pnpm start
```

## API 端点

### 用户认证

- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息

### 图片管理

- `GET /api/images` - 获取图片列表
- `POST /api/images/save` - 保存图片信息

## 环境变量

- `PORT` - 服务器端口（默认：3000）
