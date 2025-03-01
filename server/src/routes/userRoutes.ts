import { Hono } from 'hono'
import * as userController from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/auth.js'

// 创建用户路由
const userRouter = new Hono()

// 公开路由
// 登录路由
userRouter.post('/login', userController.login)

// 注册路由
userRouter.post('/register', userController.register)

// 需要鉴权的路由
// 获取用户信息路由
userRouter.get('/profile', authMiddleware, userController.getProfile)

// 测试JWT认证
userRouter.get('/test-auth', authMiddleware, userController.testAuth)

export default userRouter
