import { env } from '@/env'
import { UninstantiatedRepositoryError } from '@/errors/uninstantiated-repository-error'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export const errorHandler = (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      name: '[ZodError]: Validation Error',
      errorCount: error.issues.length,
      cause: error.cause,
      statusCode: error.statusCode,
      details: error.issues.map((issue, index) => ({
        [index + 1]: {
          message: issue.message,
          field: issue.path[0],
          code: issue.code,
        },
      })),
    })
  }

  if (error instanceof UninstantiatedRepositoryError) {
    console.error('Check for services that did not instantiate the necessary repository')
    throw error
  }

  if (env.NODE_ENV !== 'production') {
    console.error({
      ...error,
    })
  } else {
    // TODO Utilizar alguma ferramenta externa de logs de error
  }

  return reply.status(500).send({
    message: 'Internal Server Error',
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      validation: error.validation,
      validationContext: error.validationContext,
      stack: error.stack,
    },
  })
}
