import { Router } from "express";
import { createTask, deleteTask, getTasks, markTaskComplete } from "../controller/tasks.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router()

router.post('/task', authMiddleware, createTask)
router.get('/tasks', authMiddleware, getTasks)
router.patch('/task/:taskId', authMiddleware, markTaskComplete)
router.delete('/task/:taskId', authMiddleware, deleteTask)

export default router