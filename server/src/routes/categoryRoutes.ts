import { Hono } from 'hono'
import * as categoryController from '../controllers/categoryController.js'
import { authMiddleware } from '../middlewares/auth.js'

// 创建分类路由
const categoryRouter = new Hono()

// 公开API
// 获取所有分类
categoryRouter.get('/', categoryController.getAllCategories)

// 需要鉴权的API
// 创建分类
categoryRouter.post('/', authMiddleware, categoryController.createCategory)

// 获取当前用户创建的分类
categoryRouter.get('/my', authMiddleware, categoryController.getUserCategories)

export default categoryRouter
