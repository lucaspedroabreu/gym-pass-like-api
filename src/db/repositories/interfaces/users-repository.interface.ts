import { User, UserInsert } from '@/db/models'

export type UserWithoutPasswordHash = Omit<User, 'passwordHash'>

export interface UsersRepositoryInterface {
  insert(data: UserInsert): Promise<UserWithoutPasswordHash | null>
  queryByEmail(email: string): Promise<UserWithoutPasswordHash | null>
  queryById(id: string): Promise<UserWithoutPasswordHash | null>
  getPasswordHash(id: string, jwt: string): Promise<string> | never
}
