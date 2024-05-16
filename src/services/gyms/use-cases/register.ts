import { Gym, GymRequest } from '@/db/models'
import { GymsRepositoryInterface } from '@/db/repositories/interfaces/gyms-repository.interface'
import { DbOperationError } from '@/errors/db-operation-error'
import { EmailConflictError } from '@/errors/email-conflict-error'

export async function registerGymUseCase(gymsStorage: GymsRepositoryInterface, gym: GymRequest): Promise<Gym> | never {
  const isGymRegistered = await gymsStorage.queryByEmail(gym.corporateMail)
  if (isGymRegistered) {
    throw new EmailConflictError()
  }

  const newGym = await gymsStorage.insert(gym)
  if (!newGym) throw new DbOperationError()

  return newGym
}
