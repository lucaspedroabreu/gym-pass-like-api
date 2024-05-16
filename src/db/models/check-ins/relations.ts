import { relations } from 'drizzle-orm/relations'
import { locationsTable } from '../gyms/tables'
import { usersTable } from '../users/tables'
import { checkIns } from './tables'

// RELATIONSHIPS SCHEMAS
export const checkInsTableRelations = relations(checkIns, ({ one }) => ({
  checkInto: one(locationsTable, {
    fields: [checkIns.locationId],
    references: [locationsTable.id],
  }),
  belongTo: one(usersTable, {
    fields: [checkIns.userId],
    references: [usersTable.id],
  }),
}))
