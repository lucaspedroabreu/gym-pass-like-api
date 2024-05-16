import { db } from '@/db'
import * as schemas from '@/db/models'
import { User, usersTable } from '@/db/models'
import { AuthError } from '@/errors/auth-user-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { UsersRepositoryInterface } from '../interfaces/users-repository.interface'
import { DrizzleBaseRepository } from './base-repository'

export class DrizzleUsersRepository extends DrizzleBaseRepository implements UsersRepositoryInterface {
  constructor(db: NodePgDatabase<typeof schemas>) {
    super(db)
  }

  async insert(data: User) {
    const newUser = await this.repository.insert(usersTable).values(data).returning()

    const { passwordHash, ...userWithoutPasswordHash } = newUser[0]

    return userWithoutPasswordHash ? userWithoutPasswordHash : null
  }

  async queryByEmail(email: string) {
    const user = await this.repository.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })

    if (!user) return null
    const { passwordHash, ...userWithoutPasswordHash } = user

    return userWithoutPasswordHash ? userWithoutPasswordHash : null
  }

  async queryById(id: string) {
    const user = await this.repository.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    })

    if (!user) return null
    const { passwordHash, ...userWithoutPasswordHash } = user

    return userWithoutPasswordHash ? userWithoutPasswordHash : null
  }

  async getPasswordHash(id: string, jwt: string): Promise<string> | never {
    // todo JWT
    if (!!jwt) {
      const user = await this.repository.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
      })
      if (!user) throw new ResourceNotFoundError()

      return user.passwordHash
    }

    throw new AuthError('authorization')
  }
}

export const drizzleUsersRepository = new DrizzleUsersRepository(db)
