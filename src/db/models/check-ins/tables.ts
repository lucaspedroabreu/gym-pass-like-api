import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { locationsTable } from '../gyms/tables'
import { usersTable } from '../users/tables'

export const checkIns = pgTable('check_ins', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  validatedAt: timestamp('validated_at', { mode: 'date', withTimezone: true }),
  locationId: uuid('location_id')
    .notNull()
    .references(() => locationsTable.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
})
