import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@greenproof/db'

/**
 * Global Express error handler. Must be registered as the last app.use().
 * Handles ZodError (400), Prisma not-found (404), Prisma conflict (409), and all others (500).
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors → 400
  if (err instanceof ZodError) {
    const details: Record<string, string> = {}
    err.errors.forEach(e => {
      details[e.path.join('.') || 'body'] = e.message
    })
    res.status(400).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details })
    return
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found', code: 'NOT_FOUND' })
      return
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Duplicate entry', code: 'CONFLICT' })
      return
    }
  }

  // Log and return generic 500 (never leak stack traces to clients)
  const isDev = process.env.NODE_ENV === 'development'
  const message =
    isDev && err instanceof Error ? err.message : 'Internal server error'
  console.error('[API Error]', err)

  res.status(500).json({ error: message, code: 'INTERNAL_ERROR' })
}
