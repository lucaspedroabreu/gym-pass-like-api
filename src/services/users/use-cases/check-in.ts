import { CheckIn } from '@/db/models'
import { CheckInsRepositoryInterface } from '@/db/repositories/interfaces/check-ins-repository.interface'
import { GymsRepositoryInterface } from '@/db/repositories/interfaces/gyms-repository.interface'
import { UsersRepositoryInterface } from '@/db/repositories/interfaces/users-repository.interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

export type CheckInRequest = {
  userId: string
  locationId: string
}

export type validateCheckInRequest = CheckIn

export async function createCheckInUseCase(
  gymsStorage: GymsRepositoryInterface,
  usersStorage: UsersRepositoryInterface,
  checkInsStorage: CheckInsRepositoryInterface,
  request: CheckInRequest
): Promise<CheckIn> | never {
  const validUser = usersStorage.queryById(request.userId)
  if (!validUser) throw new ResourceNotFoundError()
  const validGym = gymsStorage.queryById(request.locationId)
  if (!validGym) throw new ResourceNotFoundError()

  const newCheckIn = await checkInsStorage.insert(request)

  return newCheckIn
}

export async function validateCheckInUseCase(
  checkInStorage: CheckInsRepositoryInterface,
  gymsStorage: GymsRepositoryInterface,
  checkIn: validateCheckInRequest
): Promise<CheckIn> | never {
  const gym = await gymsStorage.queryById(checkIn.id)
  if (!gym) throw new ResourceNotFoundError()
  const needValidation = gym.needsCheckInValidation

  if (!needValidation) return { ...checkIn, validatedAt: null }

  // TODO INCOMPLETE METHOD
  return checkIn
}
