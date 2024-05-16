import { Gym, GymRequest } from '@/db/models'

export interface GymsRepositoryInterface {
  insert(data: GymRequest): Promise<Gym> | never
  queryById(id: string): Promise<Gym | null>
  queryByEmail(email: string): Promise<Gym | null>
}
