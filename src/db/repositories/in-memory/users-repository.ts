import { User } from '@/db/models'
import { AuthError } from '@/errors/auth-user-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { randomUUID } from 'node:crypto'
import { UsersRepositoryInterface } from '../interfaces/users-repository.interface'

export class InMemoryUsersRepository implements UsersRepositoryInterface {
  private repository: User[] = []

  async insert(data: User) {
    const newUser = {
      ...data,
      createdAt: new Date(),
      id: randomUUID(),
    }

    this.repository.push(newUser)

    const { passwordHash, ...userWithoutPasswordHash } = newUser

    return userWithoutPasswordHash
  }

  async queryById(id: string) {
    const user = this.repository.find((user) => user.id === id)

    if (!user) return null
    const { passwordHash, ...userWithoutPasswordHash } = user

    return userWithoutPasswordHash
  }

  async queryByEmail(email: string) {
    const user = this.repository.find((user) => user.email === email)

    if (!user) return null
    const { passwordHash, ...userWithoutPasswordHash } = user

    return userWithoutPasswordHash
  }

  async getPasswordHash(id: string, jwt: string): Promise<string> | never {
    // todo JWT
    if (!!jwt) {
      const user = this.repository.find((user) => user.id === id)
      if (!user) throw new ResourceNotFoundError()

      return user.passwordHash
    }

    throw new AuthError('authorization')
  }
}

// Factory function to create new instances
export function createInMemoryUsersRepository() {
  return new InMemoryUsersRepository()
}
