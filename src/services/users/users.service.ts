import { db } from '@/db'
import { UserRequest } from '@/db/models'
import { CheckIn } from '@/db/models/check-ins/schemas'
import { DrizzleCheckInsRepository } from '@/db/repositories/drizzle/check-ins-repository'
import { DrizzleGymsRepository } from '@/db/repositories/drizzle/gyms-repository'
import { DrizzleUsersRepository } from '@/db/repositories/drizzle/users-repository'
import { InMemoryCheckInsRepository } from '@/db/repositories/in-memory/check-ins-repository'
import { InMemoryGymsRepository } from '@/db/repositories/in-memory/gyms-repository'
import { InMemoryUsersRepository } from '@/db/repositories/in-memory/users-repository'
import { CheckInsRepositoryInterface } from '@/db/repositories/interfaces/check-ins-repository.interface'
import { GymsRepositoryInterface } from '@/db/repositories/interfaces/gyms-repository.interface'
import {
  UsersRepositoryInterface,
  UserWithoutPasswordHash,
} from '@/db/repositories/interfaces/users-repository.interface'
import { env } from '@/env'
import { UninstantiatedRepositoryError } from '@/errors/uninstantiated-repository-error'
import { authenticateUseCase } from './use-cases/authenticate'
import { CheckInRequest, createCheckInUseCase, validateCheckInUseCase } from './use-cases/check-in'
import { getProfileUseCase } from './use-cases/get-profile'
import { registerUserUseCase } from './use-cases/register'

class UsersService {
  private usersStorage
  private checkInsStorage
  private gymsStorage

  constructor(
    usersStorage?: UsersRepositoryInterface,
    checkInsStorage?: CheckInsRepositoryInterface,
    gymsStorage?: GymsRepositoryInterface
  ) {
    this.usersStorage = usersStorage
    this.checkInsStorage = checkInsStorage
    this.gymsStorage = gymsStorage
  }

  public async registerNewUser(user: UserRequest): Promise<UserWithoutPasswordHash> | never {
    if (!this.usersStorage) throw new UninstantiatedRepositoryError()
    return await registerUserUseCase(this.usersStorage, user)
  }

  public async authenticateUser(
    user: Pick<UserRequest, 'email' | 'password'>
  ): Promise<UserWithoutPasswordHash> | never {
    if (!this.usersStorage) throw new UninstantiatedRepositoryError()
    return await authenticateUseCase(this.usersStorage, { email: user.email, password: user.password })
  }

  public async getUserProfile(userId: string): Promise<UserWithoutPasswordHash> | never {
    if (!this.usersStorage) throw new UninstantiatedRepositoryError()
    return await getProfileUseCase(this.usersStorage, userId)
  }

  public async checkInUserToGym(data: CheckInRequest): Promise<CheckIn> | never {
    if (!this.checkInsStorage || !this.gymsStorage || !this.usersStorage) throw new UninstantiatedRepositoryError()
    const checkIn = await createCheckInUseCase(this.gymsStorage, this.usersStorage, this.checkInsStorage, data)
    return await validateCheckInUseCase(this.checkInsStorage, this.gymsStorage, checkIn)
  }
}

// Singleton instance for integration tests
let sharedInMemoryRepository: InMemoryUsersRepository | InMemoryGymsRepository | InMemoryCheckInsRepository | null =
  null

type RepositoryType = 'gyms' | 'users' | 'check-ins'
type RepositoryMap = {
  users: InMemoryUsersRepository
  gyms: InMemoryGymsRepository
  'check-ins': InMemoryCheckInsRepository
}

function getIntegrationTestRepository<T extends RepositoryType>(repositoryType: T): RepositoryMap[T] {
  if (!sharedInMemoryRepository) {
    switch (repositoryType) {
      case 'users':
        sharedInMemoryRepository = new InMemoryUsersRepository()
        break
      case 'gyms':
        sharedInMemoryRepository = new InMemoryGymsRepository()
      case 'check-ins':
        sharedInMemoryRepository = new InMemoryCheckInsRepository()
      default:
        sharedInMemoryRepository = new InMemoryUsersRepository()
        break
    }
  }
  return sharedInMemoryRepository as RepositoryMap[T]
}

export function createUsersService(
  serviceType: 'test' | 'default' = 'default',
  testType?: 'unit' | 'integration' | 'e2e'
): UsersService {
  let usersStorage: UsersRepositoryInterface
  let checkInsStorage: CheckInsRepositoryInterface
  let gymsStorage: GymsRepositoryInterface

  if (serviceType === 'test') {
    const switchVar = testType || env.TEST_TYPE
    switch (switchVar) {
      case 'unit':
        // Fresh repository for each test
        usersStorage = new InMemoryUsersRepository()
        checkInsStorage = new InMemoryCheckInsRepository()
        gymsStorage = new InMemoryGymsRepository()
        break
      case 'integration':
        // Reuse the same repository across tests
        usersStorage = getIntegrationTestRepository('users')
        gymsStorage = getIntegrationTestRepository('gyms')
        checkInsStorage = getIntegrationTestRepository('check-ins')
        break
      case 'e2e':
        // Reuse the same repository across tests
        usersStorage = getIntegrationTestRepository('users')
        gymsStorage = getIntegrationTestRepository('gyms')
        checkInsStorage = getIntegrationTestRepository('check-ins')
        break
      default:
        // Fresh repository for each test
        usersStorage = new InMemoryUsersRepository()
        checkInsStorage = new InMemoryCheckInsRepository()
        gymsStorage = new InMemoryGymsRepository()
        break
    }
  } else {
    // Use the production repository
    usersStorage = new DrizzleUsersRepository(db)
    checkInsStorage = new DrizzleCheckInsRepository(db)
    gymsStorage = new DrizzleGymsRepository(db)
  }

  return new UsersService(usersStorage, checkInsStorage, gymsStorage)
}
