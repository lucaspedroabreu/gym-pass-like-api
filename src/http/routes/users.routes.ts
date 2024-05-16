import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify'

import { UUID } from 'crypto'
import { registerUserController } from '../controllers/register.controller'

const usersRoutes = async (app: FastifyInstance, opts: RouteShorthandOptions) => {
  app.post('/new', registerUserController)

  // TODO
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send('GET ALL USERS')
  })
  app.get('/:id', async (request: FastifyRequest<{ Params: { id: UUID } }>, reply: FastifyReply) => {
    reply.send('GET SPECIFIC SPECIFIC USER BY ID')
  })
  app.patch('/:id', async (req, reply) => {
    reply.send('UPDATED SPECIFIC USER BY ID')
  })
  app.delete('/:id', async (req, reply) => {
    reply.send('DELETED SPECIFIC USER BY ID')
  })
}

export default usersRoutes
