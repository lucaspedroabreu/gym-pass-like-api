import { requestUserSchema, UserRequest } from '@/db/models'
import { AuthError } from '@/errors/auth-user-error'
import { createUsersService } from '@/services/users/users.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export const authenticateUserController = async (
  request: FastifyRequest<{ Body: Omit<UserRequest, 'name'> }>,
  reply: FastifyReply
) => {
  const userRequest = request.body

  try {
    const parsedRequest = requestUserSchema.parse(userRequest)
    const usersService = createUsersService()
    const authenticatedUser = await usersService.authenticateUser(parsedRequest)

    reply.status(200).send({
      status: 'success',
      statusCode: 200,
      message: 'User Authenticated',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      reply.status(err.statusCode).send({ ...err })
    }

    throw err
  }
}
