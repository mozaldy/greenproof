import express, { type Express } from 'express'
import cors from 'cors'
import { onboardingRouter } from './routes/onboarding'
import { tasksRouter } from './routes/tasks'
import { submissionsRouter } from './routes/submissions'
import { validatorsRouter } from './routes/validators'
import { simulatorRouter } from './routes/simulator'
import { treasuryRouter } from './routes/treasury'
import { auditRouter } from './routes/audit'
import { configRouter } from './routes/config'
import { verifierRouter } from './routes/verifier'
import { errorHandler } from './middleware/error'

export const app: Express = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

app.use('/api/v1', onboardingRouter)
app.use('/api/v1/tasks', tasksRouter)
app.use('/api/v1', submissionsRouter)           // handles /api/v1/tasks/:id/submit
app.use('/api/v1/validators', validatorsRouter)
app.use('/api/v1/simulator', simulatorRouter)
app.use('/api/v1/treasury', treasuryRouter)
app.use('/api/v1/audit', auditRouter)
app.use('/api/v1/config', configRouter)
app.use('/api/v1/verifier', verifierRouter)

app.use(errorHandler)
