import { FastifyInstance, RouteShorthandOptions } from 'fastify'

import { authenticateUserController } from '../controllers/authentication.controller'

const authRoutes = async (app: FastifyInstance, opts: RouteShorthandOptions) => {
  app.post('/session', authenticateUserController)

  // TODO
}

export default authRoutes
