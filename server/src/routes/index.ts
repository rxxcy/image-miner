import { Hono } from 'hono'
import userRoutes from './userRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import pictureRoutes from './pictureRoutes.js'
import { success } from '../utils/response.js'

// 创建主路由
const setupRoutes = (app: Hono) => {
  // 首页路由
  app.get('/', c => {
    return success(c, {
      version: '1.0.0',
      status: 'online',
      server: '图片链接复制器API服务器运行正常',
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
