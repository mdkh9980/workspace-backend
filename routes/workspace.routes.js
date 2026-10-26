import {Router} from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { createWorkspace, deleteWorkspace, getAllWorkspaces } from '../controller/workspace.controller.js'

const router = Router()

router.post('/workspace', authMiddleware, createWorkspace)
router.get('/workspaces', authMiddleware, getAllWorkspaces)
router.delete('/workspace/:id',authMiddleware, deleteWorkspace)

export default router