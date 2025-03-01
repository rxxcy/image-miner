import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { initDb } from './db/index.js'
import setupRoutes from './routes/index.js'
import { error } from './utils/response.js'

// 初始化数据库
initDb()

// 创建Hono应用实例
const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors())

// 全局错误处理中间件
app.onError((err, c) => {
  console.error('应用错误:', err)
  return error(c, '服务器内部错误', 500)
})

// 处理404响应
app.notFound(c => {
  return error(c, '请求的资源不存在', 404)
})

// 设置路由
setupRoutes(app)

// 启动服务器
const PORT = process.env.PORT || 3000
console.log(`服务器启动在 http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
})
