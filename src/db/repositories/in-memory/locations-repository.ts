import { Location, LocationRequest } from '@/db/models'
import { LocationsRepositoryInterface } from '../interfaces/locations-repository.interface'

export class InMemoryLocationsRepository implements LocationsRepositoryInterface {
  private repository: Location[] = []
  async insert(data: LocationRequest): Promise<Location | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
  queryById(id: string): Promise<Location | null> {
    // TODO to be implemente
    throw new Error('Method not implemented.')
  }
}

// Factory function to create new instances
export function createInMemoryLocationsRepository() {
  return new InMemoryLocationsRepository()
}
