import { env } from '@/env'

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SCHEMA } = env

export const DATABASE_URL =
  `postgresql://${DB_USERNAME!}:${DB_PASSWORD!}@${DB_HOST!}:${DB_PORT!}/${DB_NAME!}?schema=${DB_SCHEMA!}` as const
