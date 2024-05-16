import { db } from '@/db'
import { Gym, GymRequest } from '@/db/models'
import { DrizzleCheckInsRepository } from '@/db/repositories/drizzle/check-ins-repository'
import { DrizzleGymsRepository } from '@/db/repositories/drizzle/gyms-repository'
import { DrizzleLocationsRepository } from '@/db/repositories/drizzle/locations-repository'
import { DrizzleUsersRepository } from '@/db/repositories/drizzle/users-repository'
import { InMemoryCheckInsRepository } from '@/db/repositories/in-memory/check-ins-repository'
import { InMemoryGymsRepository } from '@/db/repositories/in-memory/gyms-repository'
import { InMemoryLocationsRepository } from '@/db/repositories/in-memory/locations-repository'
import { InMemoryUsersRepository } from '@/db/repositories/in-memory/users-repository'
import { CheckInsRepositoryInterface } from '@/db/repositories/interfaces/check-ins-repository.interface'
import { CoordinatesRepositoryInterface } from '@/db/repositories/interfaces/coordinates-repository.interface'
import { GymsRepositoryInterface } from '@/db/repositories/interfaces/gyms-repository.interface'
import { LocationsRepositoryInterface } from '@/db/repositories/interfaces/locations-repository.interface'
import { UsersRepositoryInterface } from '@/db/repositories/interfaces/users-repository.interface'
import { env } from '@/env'
import { UninstantiatedRepositoryError } from '@/errors/uninstantiated-repository-error'
import { registerGymUseCase } from './use-cases/register'

class GymsService {
  private usersStorage
  private checkInsStorage
  private gymsStorage
  private locationsStorage
  private coordinatesStorage

  constructor(
    usersStorage?: UsersRepositoryInterface,
    checkInsStorage?: CheckInsRepositoryInterface,
    gymsStorage?: GymsRepositoryInterface,
    locationsStorage?: LocationsRepositoryInterface,
    coordinatesStorage?: CoordinatesRepositoryInterface
  ) {
    this.usersStorage = usersStorage
    this.checkInsStorage = checkInsStorage
    this.gymsStorage = gymsStorage
    this.locationsStorage = locationsStorage
    this.coordinatesStorage = coordinatesStorage
  }

  public async registerNewGym(gym: GymRequest): Promise<Gym> | never {
    if (!this.gymsStorage) throw new UninstantiatedRepositoryError()
    return await registerGymUseCase(this.gymsStorage, gym)
  }

  public async validateCheckIn(userId: string, gymId: string, locationId: string): Promise<any> | never {
    throw new Error('TODO')
  }
}

// Singleton instance for integration tests
let sharedInMemoryRepository:
  | InMemoryUsersRepository
  | InMemoryGymsRepository
  | InMemoryLocationsRepository
  | InMemoryCheckInsRepository
  | null = null

type RepositoryType = 'gyms' | 'users' | 'check-ins' | 'locations'
type RepositoryMap = {
  users: InMemoryUsersRepository
  gyms: InMemoryGymsRepository
  'check-ins': InMemoryCheckInsRepository
  locations: InMemoryLocationsRepository
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
      case 'locations':
        sharedInMemoryRepository = new InMemoryLocationsRepository()
      default:
        sharedInMemoryRepository = new InMemoryUsersRepository()
        break
    }
  }
  return sharedInMemoryRepository as RepositoryMap[T]
}

export function createGymsService(
  serviceType: 'test' | 'default' = 'default',
  testType?: 'unit' | 'integration' | 'e2e'
): GymsService {
  let usersStorage: UsersRepositoryInterface
  let checkInsStorage: CheckInsRepositoryInterface
  let gymsStorage: GymsRepositoryInterface
  let locationsStorage: LocationsRepositoryInterface

  if (serviceType === 'test') {
    const switchVar = testType || env.TEST_TYPE
    switch (switchVar) {
      case 'unit':
        // Fresh repository for each test
        usersStorage = new InMemoryUsersRepository()
        checkInsStorage = new InMemoryCheckInsRepository()
        gymsStorage = new InMemoryGymsRepository()
        locationsStorage = new InMemoryLocationsRepository()
        break
      case 'integration':
        // Reuse the same repository across tests
        usersStorage = getIntegrationTestRepository('users')
        gymsStorage = getIntegrationTestRepository('gyms')
        checkInsStorage = getIntegrationTestRepository('check-ins')
        locationsStorage = getIntegrationTestRepository('locations')
        break
      case 'e2e':
        // Reuse the same repository across tests
        usersStorage = getIntegrationTestRepository('users')
        gymsStorage = getIntegrationTestRepository('gyms')
        checkInsStorage = getIntegrationTestRepository('check-ins')
        locationsStorage = getIntegrationTestRepository('locations')
        break
      default:
        // Fresh repository for each test
        usersStorage = new InMemoryUsersRepository()
        checkInsStorage = new InMemoryCheckInsRepository()
        gymsStorage = new InMemoryGymsRepository()
        locationsStorage = new InMemoryLocationsRepository()
        break
    }
  } else {
    // Use the production repository
    usersStorage = new DrizzleUsersRepository(db)
    checkInsStorage = new DrizzleCheckInsRepository(db)
    gymsStorage = new DrizzleGymsRepository(db)
    locationsStorage = new DrizzleLocationsRepository(db)
  }

  return new GymsService(usersStorage, checkInsStorage, gymsStorage, locationsStorage)
}
