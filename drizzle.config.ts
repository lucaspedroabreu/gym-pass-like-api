import { env } from '@/env'
import type { Config } from 'drizzle-kit'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle/migrations',
  schema: './src/db/models/**/*.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
}) satisfies Config
