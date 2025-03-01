import { Hono } from 'hono'
import * as pictureController from '../controllers/pictureController.js'

// 创建图片路由
const pictureRouter = new Hono()

// 获取所有图片
pictureRouter.get('/', pictureController.getAllPictures)

// 保存图片
pictureRouter.post('/save', pictureController.savePicture)

// 按分类获取图片
pictureRouter.get(
  '/category/:categoryId',
  pictureController.getPicturesByCategory
)

export default pictureRouter
