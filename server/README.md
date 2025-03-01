# 图片链接复制器 - 后端服务

这个项目是「图片链接复制器」Chrome 扩展的后端服务，用于存储和管理用户收集的图片链接。

## 技术栈

- **Hono.js**: 轻量级、高性能的 Web 框架
- **TypeScript**: 提供类型安全
- **Drizzle ORM**: 类型安全的数据库 ORM
- **libSQL/SQLite**: 用于数据存储
- **JWT**: 用于身份验证

## 项目结构

```
server/
├── src/
│   ├── config/         # 配置文件
│   │   └── jwt.ts      # JWT配置
│   ├── controllers/    # 控制器
│   │   ├── userController.ts
│   │   ├── categoryController.ts
│   │   └── pictureController.ts
│   ├── db/             # 数据库相关
│   │   ├── schema/     # 数据库模式
│   │   └── index.ts    # 数据库初始化
│   ├── middlewares/    # 中间件
│   │   └── auth.ts     # 认证中间件
│   ├── routes/         # 路由
│   │   ├── userRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── pictureRoutes.ts
│   │   └── index.ts    # 路由聚合
│   └── index.ts        # 应用入口
├── package.json
└── tsconfig.json
```

## API 路由

### 用户 API (`/api/users`)

- `POST /api/users/register` - 注册新用户
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取当前用户信息 (需要认证)
- `GET /api/users/test-auth` - 测试认证 (需要认证)

### 分类 API (`/api/categories`)

- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建新分类 (需要认证)
- `GET /api/categories/my` - 获取当前用户的分类 (需要认证)

### 图片 API (`/api/pictures`)

- `GET /api/pictures` - 获取所有图片
- `GET /api/pictures/category/:categoryId` - 获取特定分类的图片
- `POST /api/pictures/save` - 保存新图片 (需要认证)
- `GET /api/pictures/my` - 获取当前用户的图片 (需要认证)

## 安装与运行

1. 安装依赖:

   ```
   pnpm install
   ```

2. 创建数据库:

   ```
   pnpm drizzle-kit generate
   ```

3. 运行开发服务器:

   ```
   pnpm dev
   ```

4. 构建生产版本:

   ```
   pnpm build
   ```

5. 运行生产版本:
   ```
   pnpm start
   ```

## 环境变量

创建 `.env` 文件，包含以下内容:

```
PORT=3000
DB_PATH=file:./src/db/sqlite.db
JWT_SECRET=your_secret_key
```

请确保为生产环境设置强密钥。
