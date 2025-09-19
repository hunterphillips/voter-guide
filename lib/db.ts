import { PrismaClient, Prisma } from '@prisma/client'
import { ENV, validateEnvironment } from './env'

// Validate environment on startup
validateEnvironment()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Prisma based on environment
const prismaConfig = {
  log: ENV.IS_PRODUCTION 
    ? ['error', 'warn'] as Prisma.LogLevel[]
    : ['query', 'error', 'warn'] as Prisma.LogLevel[],
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig)

if (!ENV.IS_PRODUCTION) {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})