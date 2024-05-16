import { CheckIn, CheckInRequest } from '@/db/models'

export interface CheckInsRepositoryInterface {
  insert(checkInRequest: CheckInRequest): Promise<CheckIn> | never
  validate(data: any): Promise<CheckIn> | never
}
