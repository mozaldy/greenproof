import { PrismaClient } from '@greenproof/db'

/** Singleton Prisma client. Import this from all route/service files. */
export const prisma: PrismaClient = new PrismaClient()
