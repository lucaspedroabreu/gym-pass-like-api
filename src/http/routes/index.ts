import { FastifyInstance, FastifyReply } from 'fastify'
import authRoutes from './auth.routes'
import usersRoutes from './users.routes'

const routes = async (app: FastifyInstance) => {
  app.register(usersRoutes, { prefix: '/users' })
  app.register(authRoutes, { prefix: '/auth' })

  app.get('/healthCheck', async (_, reply: FastifyReply) => {
    try {
      return reply.status(200).send({
        health: 'ok',
        success: true,
      })
    } catch (err) {
      return reply.status(500).send({
        health: 'bad',
        success: false,
        error: err,
      })
    }
  })
}

export default routes
