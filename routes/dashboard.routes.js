import {Router} from 'express'
import { getDashboardData } from '../controller/dashboard.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = Router()

router.get('/dashboard', authMiddleware, getDashboardData)

export default router