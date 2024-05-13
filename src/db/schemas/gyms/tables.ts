import { jsonb, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { OperatingHours } from './schemas'

// TABLES SCHEMAS
export const gyms = pgTable('gyms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  corporateMail: varchar('email', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  phone: varchar('phone', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})
export const locations = pgTable('gym_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  gymId: uuid('gym_id')
    .notNull()
    .references(() => gyms.id),
  branchName: varchar('unity_name', { length: 255 }).notNull(),
  branchMail: varchar('email', { length: 255 }).notNull().unique(),
  operatingHours: jsonb('operating_hours').notNull().$type<OperatingHours>(), // Store operating hours as JSONB
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})

export const coordinatesTable = pgTable('coordinates', {
  id: uuid('id').primaryKey(),
  locationId: uuid('location_id')
    .notNull()
    .references(() => locations.id), // Foreign key referencing location
  latitude: numeric('latitude', { precision: 9, scale: 6 }), // Increased scale for latitude
  longitude: numeric('longitude', { precision: 9, scale: 6 }), // Increased scale for longitude
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})
