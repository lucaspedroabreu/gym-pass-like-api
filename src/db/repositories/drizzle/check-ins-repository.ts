import { db } from '@/db'
import * as schemas from '@/db/models'
import { CheckIn, CheckInRequest, checkIns } from '@/db/models'
import { DbOperationError } from '@/errors/db-operation-error'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CheckInsRepositoryInterface } from '../interfaces/check-ins-repository.interface'
import { DrizzleBaseRepository } from './base-repository'

export class DrizzleCheckInsRepository extends DrizzleBaseRepository implements CheckInsRepositoryInterface {
  constructor(db: NodePgDatabase<typeof schemas>) {
    super(db)
  }

  async insert(checkInRequest: CheckInRequest): Promise<CheckIn> {
    const newCheckIn = await this.repository.insert(checkIns).values(checkInRequest).returning()
    if (!newCheckIn) throw new DbOperationError()

    return newCheckIn[0]
  }

  validate(data: any): Promise<schemas.CheckIn> {
    throw new Error('Method not implemented.')
  }
}

export const drizzleUsersRepository = new DrizzleCheckInsRepository(db)
