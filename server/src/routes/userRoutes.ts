import { Hono } from 'hono'
import * as userController from '../controllers/userController.js'

// 创建用户路由
const userRouter = new Hono()

// 登录路由
userRouter.post('/login', userController.login)

// 注册路由
userRouter.post('/register', userController.register)

// 获取用户信息路由
userRouter.get('/profile', userController.getProfile)

export default userRouter
