import { User } from '@/db/models'
import { UsersRepositoryInterface } from '@/db/repositories/interfaces/users-repository.interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

export async function getProfileUseCase(
  storage: UsersRepositoryInterface,
  userId: string
): Promise<Omit<User, 'passwordHash'>> | never {
  const foundUser = await storage.queryById(userId)
  if (!foundUser) throw new ResourceNotFoundError()

  return foundUser
}
