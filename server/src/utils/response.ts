import { Context } from 'hono'

// Hono支持的HTTP状态码类型
type StatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511

/**
 * 统一成功响应
 * @param c Hono上下文
 * @param data 响应数据
 * @param message 响应消息
 * @returns 格式化的JSON响应
 */
export const success = (
  c: Context,
  data: any = {},
  message: string = 'success'
) => {
  return c.json({
    code: 200,
    message,
    data,
  })
}

/**
 * 统一错误响应
 * @param c Hono上下文
 * @param message 错误消息
 * @param statusCode HTTP状态码
 * @param data 额外数据
 * @returns 格式化的JSON错误响应
 */
export const error = (
  c: Context,
  message: string = '服务器错误',
  statusCode: 400 | 401 | 403 | 404 | 500 = 500,
  data: any = {}
) => {
  c.status(statusCode)
  return c.json({
    code: statusCode,
    message,
    data,
  })
}
