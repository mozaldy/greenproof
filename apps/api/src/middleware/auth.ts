import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

export interface AuthPayload {
  userId: string
  companyId?: string
  role: string
  suiAddress?: string
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

/** Middleware: verifies Bearer JWT and attaches auth payload to req.auth */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' })
    return
  }
  try {
    req.auth = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET ?? 'dev-secret-change-me'
    ) as AuthPayload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' })
  }
}

/** Middleware factory: requires the authenticated user to have one of the given roles */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE' })
      return
    }
    next()
  }
}

/** Issues a signed JWT for the given auth payload */
export function issueToken(payload: AuthPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET ?? 'dev-secret-change-me', {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  })
}
