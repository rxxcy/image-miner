import { Hono } from 'hono'
import * as categoryController from '../controllers/categoryController.js'

// 创建分类路由
const categoryRouter = new Hono()

// 获取所有分类
categoryRouter.get('/', categoryController.getAllCategories)

// 创建分类
categoryRouter.post('/', categoryController.createCategory)

// 获取用户创建的分类
categoryRouter.get('/user/:userId', categoryController.getUserCategories)

export default categoryRouter
