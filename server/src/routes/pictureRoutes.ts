import { Hono } from 'hono'
import * as pictureController from '../controllers/pictureController.js'
import { authMiddleware } from '../middlewares/auth.js'

// 创建图片路由
const pictureRouter = new Hono()

// 公开API
// 获取所有图片
pictureRouter.get('/', pictureController.getAllPictures)

// 按分类获取图片
pictureRouter.get(
  '/category/:categoryId',
  pictureController.getPicturesByCategory
)

// 需要鉴权的API
// 保存图片
pictureRouter.post('/save', authMiddleware, pictureController.savePicture)

// 获取当前用户的图片
pictureRouter.get('/my', authMiddleware, pictureController.getMyPictures)

export default pictureRouter
