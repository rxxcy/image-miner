import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema/schema.js'

// 数据库文件路径
const DB_PATH = process.env.DB_PATH || 'file:./src/db/sqlite.db'

// 创建SQLite连接
const client = createClient({
  url: DB_PATH,
})

// 创建drizzle实例
export const db = drizzle(client, { schema })

// 初始化数据库（如果需要）
export const initDb = async () => {
  try {
    // 这里不再需要手动迁移，因为我们会使用drizzle-kit migrate命令
    console.log('数据库连接成功')
    return true
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return false
  }
}

// 导出模式
export { schema }
