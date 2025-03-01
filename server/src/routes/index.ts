import { Hono } from 'hono'
import userRoutes from './userRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import pictureRoutes from './pictureRoutes.js'
import { success } from '../utils/response.js'
import { getStats } from '../utils/stats.js'

// 创建主路由
const setupRoutes = (app: Hono) => {
  // 首页路由
  app.get('/', c => {
    const stats = getStats()

    return success(c, {
      version: '1.0.0',
      status: 'online',
      stats: {
        requestCount: stats.requestCount,
        uptime: stats.formattedUptime,
        startTime: stats.startTime,
      },
    })
  })

  // 挂载用户路由
  app.route('/api/users', userRoutes)

  // 挂载分类路由
  app.route('/api/categories', categoryRoutes)

  // 挂载图片路由
  app.route('/api/pictures', pictureRoutes)

  return app
}

export default setupRoutes
