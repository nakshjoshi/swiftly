import { PrismaClient } from "../../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { env } from "./env"

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  // Fail a request after 10s instead of hanging forever when every connection is busy or the DB is unreachable
  connectionTimeoutMillis: 10_000,
  // Release idle connections after 30s (serverless Postgres like Neon also closes idle ones on its side)
  idleTimeoutMillis: 30_000,
})

const prisma = new PrismaClient({
  adapter
})

export default prisma