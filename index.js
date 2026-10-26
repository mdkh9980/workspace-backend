import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import workspaceRouter from './routes/workspace.routes.js'
import tasksRouter from './routes/tasks.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

const app = express();

app.use(express.json())

app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
}))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is listen at port ${PORT}`)
})

app.use('/auth', authRouter)
app.use('/', workspaceRouter)
app.use('/', tasksRouter)
app.use('/', dashboardRouter)