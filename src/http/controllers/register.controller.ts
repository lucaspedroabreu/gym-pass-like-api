import { requestUserSchema, UserRequest } from '@/db/models'
import { EmailConflictError } from '@/errors/email-conflict-error'
import { createUsersService } from '@/services/users/users.service'
import { FastifyReply, FastifyRequest } from 'fastify'

export const registerUserController = async (
  request: FastifyRequest<{ Body: { user: UserRequest } }>,
  reply: FastifyReply
) => {
  const { user } = request.body

  try {
    const parsedUser = requestUserSchema.parse(user)
    const usersService = createUsersService()
    const newUser = await usersService.registerNewUser(parsedUser)

    reply.status(201).send({
      status: 'success',
      statusCode: 201,
      message: 'User created',
      user: newUser,
    })
  } catch (err) {
    if (err instanceof EmailConflictError) {
      reply.status(err.statusCode).send({ ...err })
    }

    throw err
  }
}
