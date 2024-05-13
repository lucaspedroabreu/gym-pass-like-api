import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { locations } from './gyms/tables'

export const checkins = pgTable('check_ins', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  validatedAt: timestamp('validated_at', { mode: 'date', withTimezone: true }),
  locationId: uuid('location_id')
    .notNull()
    .references(() => locations.id),
})
