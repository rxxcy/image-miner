import { Context } from 'hono'
import { db } from '../db/index.js'
import { pictures } from '../db/schema/schema.js'
import { eq } from 'drizzle-orm'

// 获取所有图片
export const getAllPictures = async (c: Context) => {
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
}

// 保存图片
export const savePicture = async (c: Context) => {
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
}

// 按分类获取图片
export const getPicturesByCategory = async (c: Context) => {
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
}
