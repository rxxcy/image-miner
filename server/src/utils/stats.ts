/**
 * 服务器统计信息
 */

// 服务器启动时间
const startTime = new Date()

// 请求计数器
let requestCount = 0

/**
 * 增加请求计数
 */
export const incrementRequestCount = () => {
  requestCount++
}

/**
 * 获取服务器运行时间（毫秒）
 */
export const getUptime = () => {
  return Date.now() - startTime.getTime()
}

/**
 * 获取格式化的运行时间字符串
 * @returns 格式化的时间字符串（如 "2天 3小时 45分钟"）
 */
export const getFormattedUptime = () => {
  const uptime = getUptime()

  const seconds = Math.floor(uptime / 1000) % 60
  const minutes = Math.floor(uptime / (1000 * 60)) % 60
  const hours = Math.floor(uptime / (1000 * 60 * 60)) % 24
  const days = Math.floor(uptime / (1000 * 60 * 60 * 24))

  let result = ''
  if (days > 0) result += `${days}天`
  if (hours > 0 || days > 0) result += `${hours}小时`
  if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}分钟`
  result += `${seconds}秒`

  return result
}

/**
 * 获取所有统计信息
 */
export const getStats = () => {
  return {
    requestCount,
    uptime: getUptime(),
    formattedUptime: getFormattedUptime(),
    startTime: startTime.toISOString(),
  }
}
