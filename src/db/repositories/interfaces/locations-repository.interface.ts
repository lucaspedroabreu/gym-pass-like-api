import { Location, LocationRequest } from '@/db/models'

export interface LocationsRepositoryInterface {
  insert(data: LocationRequest): Promise<Location | null>
  queryById(id: string): Promise<Location | null>
}
