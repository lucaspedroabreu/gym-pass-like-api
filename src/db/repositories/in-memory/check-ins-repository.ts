import { CheckIn } from '@/db/models'
import { CheckInRequest } from '@/services/users/use-cases/check-in'
import { randomUUID } from 'node:crypto'
import { CheckInsRepositoryInterface } from '../interfaces/check-ins-repository.interface'

export class InMemoryCheckInsRepository implements CheckInsRepositoryInterface {
  private repository: CheckIn[] = []

  async insert(checkInRequest: CheckInRequest): Promise<CheckIn> {
    const newCheckIn: CheckIn = {
      id: randomUUID(),
      ...checkInRequest,
      createdAt: new Date(),
      validatedAt: null,
    }

    this.repository.push(newCheckIn)

    return newCheckIn
  }

  validate(data: any): Promise<CheckIn> {
    throw new Error('Method not implemented.')
  }
}

// Factory function to create new instances
export function createInMemoryUsersRepository() {
  return new InMemoryCheckInsRepository()
}
