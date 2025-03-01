# 图片链接复制器 API 服务器部署指南

本文档提供将图片链接复制器 API 服务器部署到生产环境的指南。

## 前提条件

- Node.js v18+
- pnpm 包管理器
- 生产服务器（VPS、云服务器等）

## 部署步骤

### 1. 克隆代码库

```bash
git clone <仓库URL>
cd pic-home/server
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 创建环境变量

创建 `.env` 文件并配置环境变量：

```bash
cp .env.example .env
# 编辑 .env 文件，设置安全的 JWT_SECRET
```

### 4. 构建项目

```bash
pnpm build
```

### 5. 数据库迁移

```bash
pnpm drizzle-kit generate
```

### 6. 启动服务器

#### 直接启动

```bash
pnpm start
```

#### 使用 PM2 进行进程管理（推荐）

安装 PM2:

```bash
npm install -g pm2
```

创建 `ecosystem.config.js` 文件：

```javascript
module.exports = {
  apps: [
    {
      name: 'pic-home-api',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
```

启动应用：

```bash
pm2 start ecosystem.config.js
```

其他常用 PM2 命令：

```bash
pm2 status       # 查看应用状态
pm2 logs         # 查看日志
pm2 restart all  # 重启所有应用
pm2 stop all     # 停止所有应用
```

### 7. 配置反向代理（Nginx 示例）

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. 配置 HTTPS（建议）

使用 Let's Encrypt 配置 HTTPS：

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

## 监控和维护

- 设置日志轮转
- 配置监控服务（如 UptimeRobot 或 Pingdom）
- 定期备份数据库

## 故障排除

### 服务器无法启动

- 检查日志文件
- 确认端口没有被占用
- 验证环境变量配置

### 数据库连接问题

- 确认数据库文件路径正确
- 检查文件权限

### JWT 认证问题

- 确认 JWT_SECRET 已正确设置
- 检查令牌过期时间设置
