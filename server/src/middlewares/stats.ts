import { Context, Next } from 'hono'
import { incrementRequestCount } from '../utils/stats.js'

/**
 * 请求统计中间件
 * 每次API请求都会增加请求计数
 */
export const statsMiddleware = async (c: Context, next: Next) => {
  // 增加请求计数
  incrementRequestCount()

  // 继续执行下一个中间件
  await next()
}
