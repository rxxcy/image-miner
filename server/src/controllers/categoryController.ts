import { Context } from 'hono'
import { db } from '../db/index.js'
import { categories } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'
import { success, error } from '../utils/response.js'

// 获取所有分类
export const getAllCategories = async (c: Context) => {
  try {
    const allCategories = await db.select().from(categories)
    return success(c, {
      categories: allCategories,
    })
  } catch (err) {
    console.error('获取分类错误:', err)
    return error(c)
  }
}

// 创建分类
export const createCategory = async (c: Context) => {
  const { name, description } = await c.req.json()

  // 从中间件获取当前用户
  const user = c.get('user')

  try {
    const result = await db
      .insert(categories)
      .values({
        name,
        description,
        userId: user.id, // 使用当前登录用户的ID
      })
      .returning()
      .get()

    return success(c, {
      category: result,
    })
  } catch (err) {
    console.error('创建分类错误:', err)
    return error(c)
  }
}

// 获取用户创建的分类
export const getUserCategories = async (c: Context) => {
  // 从中间件获取当前用户
  const user = c.get('user')

  try {
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.id))

    return success(c, {
      categories: userCategories,
    })
  } catch (err) {
    console.error('获取用户分类错误:', err)
    return error(c)
  }
}
