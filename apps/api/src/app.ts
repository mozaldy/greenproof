import express from 'express'
import cors from 'cors'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Routes will be mounted here as they are built:
// app.use('/api/v1/auth',       authRouter)
// app.use('/api/v1/tasks',      tasksRouter)
// app.use('/api/v1/submissions', submissionsRouter)
// app.use('/api/v1/validators', validatorsRouter)
// app.use('/api/v1/simulator',  simulatorRouter)
// app.use('/api/v1/walrus',     walrusRouter)
// app.use('/api/v1/stats',      statsRouter)
