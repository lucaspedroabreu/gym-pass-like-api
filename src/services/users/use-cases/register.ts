import { UserRequest } from '@/db/models'
import {
  UsersRepositoryInterface,
  UserWithoutPasswordHash,
} from '@/db/repositories/interfaces/users-repository.interface'
import { DbOperationError } from '@/errors/db-operation-error'
import { EmailConflictError } from '@/errors/email-conflict-error'
import { hashPassword } from '@/libs/auth'

export async function registerUserUseCase(
  storage: UsersRepositoryInterface,
  user: UserRequest
): Promise<UserWithoutPasswordHash> | never {
  const emailAlreadyRegistered = await storage.queryByEmail(user.email)
  if (emailAlreadyRegistered) {
    throw new EmailConflictError()
  }

  const hashedPassword = await hashPassword(user.password)
  const newUser = await storage.insert({ ...user, passwordHash: hashedPassword })
  if (!newUser) throw new DbOperationError()

  return newUser
}
