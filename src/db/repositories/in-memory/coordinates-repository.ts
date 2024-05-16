import { Coordinates, CoordinatesRequest } from '@/db/models'
import { CoordinatesRepositoryInterface } from '../interfaces/coordinates-repository.interface'

export class InMemoryCoordinatesRepository implements CoordinatesRepositoryInterface {
  private repository: Coordinates[] = []
  async insert(data: CoordinatesRequest): Promise<Coordinates | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
  queryById(id: string): Promise<Coordinates | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
}

// Factory function to create new instances
export function createInMemoryCoordinatesRepository() {
  return new InMemoryCoordinatesRepository()
}
