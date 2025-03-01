// JWT配置
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  'your-secret-key-for-jwt-please-change-in-production'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d' // 默认7天过期
