import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'
import { db } from '../db/index.js'
import { users } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'

// 用户认证中间件
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        code: 401,
        message: '未授权访问',
        data: null,
      },
      401
    )
  }

  try {
    // 提取token
    const token = authHeader.split(' ')[1]

    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number
      username: string
    }

    // 从数据库获取用户
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .get()

    if (!user) {
      return c.json(
        {
          code: 401,
          message: '用户不存在',
          data: null,
        },
        401
      )
    }

    // 将用户信息添加到请求对象中
    c.set('user', user)

    // 继续执行后续中间件或处理函数
    await next()
  } catch (error) {
    console.error('验证令牌错误:', error)
    return c.json(
      {
        code: 401,
        message: '无效的令牌',
        data: null,
      },
      401
    )
  }
}

// 可选：创建一个类型扩展，让TypeScript知道用户对象的存在
declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: number
      username: string
      password: string
      email: string | null
      createdAt: string | null
      updatedAt: string | null
    }
  }
}
