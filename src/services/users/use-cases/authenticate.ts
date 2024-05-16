import { UserRequest } from '@/db/models'
import {
  UsersRepositoryInterface,
  UserWithoutPasswordHash,
} from '@/db/repositories/interfaces/users-repository.interface'
import { AuthError } from '@/errors/auth-user-error'
import { validatePassword } from '@/libs/auth'

export async function authenticateUseCase(
  storage: UsersRepositoryInterface,
  user: Pick<UserRequest, 'email' | 'password'>
): Promise<UserWithoutPasswordHash> | never {
  const foundUser = await storage.queryByEmail(user.email)
  if (!foundUser) throw new AuthError()

  const storedHash = await storage.getPasswordHash(foundUser.id, 'jwt')
  const validatedPassword = await validatePassword(user.password, storedHash)
  if (!validatedPassword) throw new AuthError()

  return foundUser
}
