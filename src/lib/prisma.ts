import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma_v2: PrismaClient | undefined };

export const prisma = (() => {
  if (globalForPrisma.prisma_v2) return globalForPrisma.prisma_v2;

  // Ensure DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required but missing.');
  }

  const connectionString = process.env.DATABASE_URL;

  // Initialize standard Postgres connection pool
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma_v2 = client;
  }

  return client;
})();