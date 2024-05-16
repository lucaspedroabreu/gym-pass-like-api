import { db } from '@/db'
import * as schemas from '@/db/models'
import { Coordinates, coordinatesTable, Location, LocationRequest, locationsTable } from '@/db/models'
import { DbOperationError } from '@/errors/db-operation-error'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { LocationsRepositoryInterface } from '../interfaces/locations-repository.interface'
import { DrizzleBaseRepository } from './base-repository'

export class DrizzleLocationsRepository extends DrizzleBaseRepository implements LocationsRepositoryInterface {
  constructor(db: NodePgDatabase<typeof schemas>) {
    super(db)
  }

  async insert(data: LocationRequest): Promise<Location & Coordinates> | never {
    let newLocation: Location[] = []
    let newCoordinates: Coordinates[] = []

    await this.repository.transaction(async (tx) => {
      newLocation = await tx
        .insert(locationsTable)
        .values({
          branchName: data.branchName,
          branchMail: data.branchMail,
          branchPhone: data.branchPhone,
          gymId: data.gymId,
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

    if (!newCoordinates || !newLocation) throw new DbOperationError()

    const result: Location & Coordinates = {
      ...newLocation[0],
      ...newCoordinates[0],
    }

    return result
  }

  queryById(id: string): Promise<Location | null> {
    // TODO to be implemented
    throw new Error('Method not implemented.')
  }
}

export const drizzleUsersRepository = new DrizzleLocationsRepository(db)
