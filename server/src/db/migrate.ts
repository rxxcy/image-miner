import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { join } from 'path'

// 数据库文件路径
const DB_PATH = process.env.DB_PATH || 'file:./src/db/sqlite.db'

// 主函数
async function main() {
  console.log('开始执行数据库迁移...')

  try {
    // 创建SQLite连接
    const client = createClient({
      url: DB_PATH,
    })

    // 创建drizzle实例
    const db = drizzle(client)

    // 迁移文件夹的相对路径
    const migrationsFolder = join(process.cwd(), 'drizzle')
    console.log(`迁移文件夹: ${migrationsFolder}`)

    // 执行迁移
    await migrate(db, { migrationsFolder })
    console.log('数据库迁移成功完成!')

    // 关闭连接
    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('数据库迁移失败:', error)
    process.exit(1)
  }
}

// 执行主函数
main()
