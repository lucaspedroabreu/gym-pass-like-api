import { db } from '@/db'
import * as schemas from '@/db/models'
import { Coordinates, coordinatesTable, Gym, GymRequest, gymsTable, Location, locationsTable } from '@/db/models'
import { DbOperationError } from '@/errors/db-operation-error'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { GymsRepositoryInterface } from '../interfaces/gyms-repository.interface'
import { DrizzleBaseRepository } from './base-repository'

export class DrizzleGymsRepository extends DrizzleBaseRepository implements GymsRepositoryInterface {
  constructor(db: NodePgDatabase<typeof schemas>) {
    super(db)
  }

  async insert(data: GymRequest): Promise<Gym & Location & Coordinates> | never {
    let newGym: Gym[] = []
    let newLocation: Location[] = []
    let newCoordinates: Coordinates[] = []

    await this.repository.transaction(async (tx) => {
      newGym = await tx
        .insert(gymsTable)
        .values({
          name: data.name,
          corporateMail: data.corporateMail,
          corporatePhone: data.corporatePhone,
          gymDescription: data.gymDescription,
          needsCheckInValidation: data.needsCheckInValidation,
          createdAt: new Date(),
        })
        .returning()

      if (!newGym[0]) throw new DbOperationError()

      newLocation = await tx
        .insert(locationsTable)
        .values({
          branchName: data.branchName,
          branchMail: data.branchMail,
          branchPhone: data.branchPhone,
          gymId: newGym[0].id,
          operatingHours: data.operatingHours,
          createdAt: new Date(),
          branchDescription: data.branchDescription,
        })
        .returning()

      if (!newLocation[0]) throw new DbOperationError()

      newCoordinates = await tx
        .insert(coordinatesTable)
        .values({
          locationId: newLocation[0].id,
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .returning()

      if (!newCoordinates[0]) throw new DbOperationError()
    })

    if (!newGym || !newLocation) throw new DbOperationError()

    const result: Gym & Location & Coordinates = {
      ...newGym[0],
      ...newLocation[0],
      ...newCoordinates[0],
    }

    return result
  }

  async queryById(id: string): Promise<Gym | null> {
    const gym = await this.repository.query.gymsTable.findFirst({
      where: eq(gymsTable.id, id),
    })

    if (!gym) return null
    return gym
  }

  async queryByEmail(email: string): Promise<Gym | null> {
    const gym = await this.repository.query.gymsTable.findFirst({
      where: eq(gymsTable.corporateMail, email),
    })

    if (!gym) return null
    return gym
  }
}

export const drizzleUsersRepository = new DrizzleGymsRepository(db)
