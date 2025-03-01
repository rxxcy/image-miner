import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { db, initDb } from './db/index.js'
import { eq } from 'drizzle-orm'
import { users, categories, pictures } from './db/schema/schema.js'

// 初始化数据库
initDb()

// 创建Hono应用实例
const app = new Hono()

// 中间件
app.use('*', logger())
app.use('*', cors())

// 路由
app.get('/', c => {
  return c.json({
    message: '图片链接复制器API服务器运行正常',
    version: '1.0.0',
    status: 'online',
  })
})

// 用户相关API
const userRouter = new Hono()

// 登录API
userRouter.post('/login', async c => {
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
})

// 注册用户
userRouter.post('/register', async c => {
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
})

// 获取用户信息
userRouter.get('/profile', async c => {
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
})

// 挂载用户路由
app.route('/api/users', userRouter)

// 分类相关API
const categoryRouter = new Hono()

// 获取所有分类
categoryRouter.get('/', async c => {
  try {
    const allCategories = await db.select().from(categories)
    return c.json({
      success: true,
      categories: allCategories,
    })
  } catch (error) {
    console.error('获取分类错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 创建分类
categoryRouter.post('/', async c => {
  const { name, description, userId } = await c.req.json()

  try {
    const result = await db
      .insert(categories)
      .values({
        name,
        description,
        userId,
      })
      .returning()
      .get()

    return c.json({
      success: true,
      category: result,
    })
  } catch (error) {
    console.error('创建分类错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 获取用户创建的分类
categoryRouter.get('/user/:userId', async c => {
  const userId = parseInt(c.req.param('userId'))

  try {
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))

    return c.json({
      success: true,
      categories: userCategories,
    })
  } catch (error) {
    console.error('获取用户分类错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 挂载分类路由
app.route('/api/categories', categoryRouter)

// 图片相关API
const imageRouter = new Hono()

// 获取图片列表
imageRouter.get('/', async c => {
  try {
    const allPictures = await db.select().from(pictures)
    return c.json({
      success: true,
      pictures: allPictures,
    })
  } catch (error) {
    console.error('获取图片错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 保存图片
imageRouter.post('/save', async c => {
  const { url, title, description, categoryId, userId } = await c.req.json()

  try {
    const result = await db
      .insert(pictures)
      .values({
        url,
        title,
        description,
        categoryId,
        userId,
      })
      .returning()
      .get()

    return c.json({
      success: true,
      picture: result,
    })
  } catch (error) {
    console.error('保存图片错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 按分类获取图片
imageRouter.get('/category/:categoryId', async c => {
  const categoryId = parseInt(c.req.param('categoryId'))

  try {
    const categoryPictures = await db
      .select()
      .from(pictures)
      .where(eq(pictures.categoryId, categoryId))

    return c.json({
      success: true,
      pictures: categoryPictures,
    })
  } catch (error) {
    console.error('按分类获取图片错误:', error)
    return c.json(
      {
        success: false,
        message: '服务器错误',
      },
      500
    )
  }
})

// 挂载图片路由
app.route('/api/pictures', imageRouter)

// 启动服务器
const PORT = process.env.PORT || 3000
console.log(`服务器启动在 http://localhost:${PORT}`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
})
