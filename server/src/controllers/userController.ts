import { Context } from 'hono'
import { db } from '../db/index.js'
import { users } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'

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
      return c.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          token: 'demo-token-' + Date.now(),
        },
      })
    }

    return c.json(
      {
        success: false,
        message: '用户名或密码错误',
      },
      401
    )
  } catch (error) {
    console.error('登录错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
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
      return c.json(
        {
          success: false,
          message: '用户名已存在',
        },
        400
      )
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

    return c.json({
      success: true,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
      },
    })
  } catch (error) {
    console.error('注册错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
}

// 获取用户信息控制器
export const getProfile = async (c: Context) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        message: '未授权访问',
      },
      401
    )
  }

  // 在真实应用中，应该验证token并获取用户ID
  // 这里我们模拟使用ID为1的用户
  try {
    const user = await db.select().from(users).where(eq(users.id, 1)).get()

    if (!user) {
      return c.json(
        {
          success: false,
          message: '用户不存在',
        },
        404
      )
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
}
