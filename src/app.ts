import dotenv from 'dotenv'
import Fastify from 'fastify'
import pretty from 'pino-pretty'
import { env } from './env'
import { errorHandler } from './libs/errorHandler'
dotenv.config()

const isDevelopment = env.NODE_ENV === 'development' || !env.NODE_ENV

const prettyConfig = isDevelopment
  ? pretty({
      colorize: true,
      translateTime: 'SYS:standard',
    })
  : undefined

export const app = Fastify({
  logger: {
    level: 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
        }
      : undefined,
    stream: prettyConfig,
  },
})

app.setErrorHandler(errorHandler)
