import { Coordinates, CoordinatesRequest } from '@/db/models'

export interface CoordinatesRepositoryInterface {
  insert(data: CoordinatesRequest): Promise<Coordinates | null>
  queryById(id: string): Promise<Coordinates | null>
}
