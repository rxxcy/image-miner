import { Context } from 'hono'
import { db } from '../db/index.js'
import { users } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js'
import { success, error } from '../utils/response.js'

// 登录控制器
export const login = async (c: Context) => {
  const { username, password } = await c.req.json()

  try {
    // 查询用户
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get()

    // 这里应该比较密码哈希，为了简单，我们直接比较明文
    if (user && user.password === password) {
      // 生成JWT令牌
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET
      )

      return success(c, {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      })
    }

    return error(c, '用户名或密码错误', 401)
  } catch (err) {
    console.error('登录错误:', err)
    return error(c)
  }
}

// 注册控制器
export const register = async (c: Context) => {
  const { username, password, email } = await c.req.json()

  try {
    // 检查用户名是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get()

    if (existingUser) {
      return error(c, '用户名已存在', 400)
    }

    // 创建新用户
    const result = await db
      .insert(users)
      .values({
        username,
        password, // 实际应用中应该存储哈希密码
        email,
      })
      .returning()
      .get()

    // 生成JWT令牌
    const token = jwt.sign(
      {
        id: result.id,
        username: result.username,
      },
      JWT_SECRET
    )

    return success(c, {
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
      },
      token,
    })
  } catch (err) {
    console.error('注册错误:', err)
    return error(c)
  }
}

// 获取用户信息控制器
export const getProfile = async (c: Context) => {
  try {
    // 通过中间件获取当前用户
    const user = c.get('user')

    return success(c, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error('获取用户信息错误:', err)
    return error(c)
  }
}

// 测试JWT验证
export const testAuth = async (c: Context) => {
  try {
    // 通过中间件获取当前用户
    const user = c.get('user')

    return success(c, {
      message: '认证成功',
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (err) {
    console.error('测试认证错误:', err)
    return error(c)
  }
}
