import * as schemas from '@/db/models'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleBaseRepository {
  protected repository: NodePgDatabase<typeof schemas>

  constructor(db: NodePgDatabase<typeof schemas>) {
    this.repository = db
  }
}
