import { Gym, GymRequest } from '@/db/models'
import { GymsRepositoryInterface } from '../interfaces/gyms-repository.interface'

export class InMemoryGymsRepository implements GymsRepositoryInterface {
  private repository: Gym[] = []
  insert(data: GymRequest): Promise<Gym> | never {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
  queryById(id: string): Promise<Gym | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
  queryByEmail(email: string): Promise<Gym | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
}

// Factory function to create new instances
export function createInMemoryGymsRepository() {
  return new InMemoryGymsRepository()
}
