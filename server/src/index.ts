import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { initDb } from './db/index.js'
import setupRoutes from './routes/index.js'

// 初始化数据库
initDb()

// 创建Hono应用实例
const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors())

// 设置路由
setupRoutes(app)

// 启动服务器
const PORT = process.env.PORT || 3000
console.log(`服务器启动在 http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
})
