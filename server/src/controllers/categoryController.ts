import { Context } from 'hono'
import { db } from '../db/index.js'
import { categories } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'

// 获取所有分类
export const getAllCategories = async (c: Context) => {
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
}

// 创建分类
export const createCategory = async (c: Context) => {
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
}

// 获取用户创建的分类
export const getUserCategories = async (c: Context) => {
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
}
