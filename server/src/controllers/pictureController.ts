import { Context } from 'hono'
import { db } from '../db/index.js'
import { pictures } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'
import { success, error } from '../utils/response.js'

// 获取所有图片
export const getAllPictures = async (c: Context) => {
  try {
    const allPictures = await db.select().from(pictures)
    return success(c, {
      pictures: allPictures,
    })
  } catch (err) {
    console.error('获取图片错误:', err)
    return error(c)
  }
}

// 保存图片
export const savePicture = async (c: Context) => {
  const { url, title, description, categoryId } = await c.req.json()

  // 从中间件获取当前用户
  const user = c.get('user')

  try {
    const result = await db
      .insert(pictures)
      .values({
        url,
        title,
        description,
        categoryId,
        userId: user.id, // 使用当前登录用户的ID
      })
      .returning()
      .get()

    return success(c, {
      picture: result,
    })
  } catch (err) {
    console.error('保存图片错误:', err)
    return error(c)
  }
}

// 按分类获取图片
export const getPicturesByCategory = async (c: Context) => {
  const categoryId = parseInt(c.req.param('categoryId'))

  try {
    const categoryPictures = await db
      .select()
      .from(pictures)
      .where(eq(pictures.categoryId, categoryId))

    return success(c, {
      pictures: categoryPictures,
    })
  } catch (err) {
    console.error('按分类获取图片错误:', err)
    return error(c)
  }
}

// 获取当前用户的图片
export const getMyPictures = async (c: Context) => {
  // 从中间件获取当前用户
  const user = c.get('user')

  try {
    const userPictures = await db
      .select()
      .from(pictures)
      .where(eq(pictures.userId, user.id))

    return success(c, {
      pictures: userPictures,
    })
  } catch (err) {
    console.error('获取用户图片错误:', err)
    return error(c)
  }
}
