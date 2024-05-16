import { boolean, jsonb, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { OperatingHours } from './schemas'

// TABLES SCHEMAS
export const gymsTable = pgTable('gyms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  corporateMail: varchar('email', { length: 255 }).notNull().unique(),
  gymDescription: varchar('gym_description', { length: 255 }),
  corporatePhone: varchar('corporate_phone', { length: 255 }).notNull(),
  needsCheckInValidation: boolean('needs_check_in_validation').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})
export const locationsTable = pgTable('gym_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  gymId: uuid('gym_id')
    .notNull()
    .references(() => gymsTable.id),
  branchName: varchar('unity_name', { length: 255 }).notNull(),
  branchMail: varchar('branch_email', { length: 255 }).notNull().unique(),
  branchPhone: varchar('branch_phone', { length: 255 }).notNull(),
  branchDescription: varchar('branch_description', { length: 255 }),
  operatingHours: jsonb('operating_hours').notNull().$type<OperatingHours>(), // Store operating hours as JSONB
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})

export const coordinatesTable = pgTable('coordinates', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id')
    .notNull()
    .references(() => locationsTable.id), // Foreign key referencing location
  latitude: numeric('latitude', { precision: 9, scale: 6 }).notNull(), // Increased scale for latitude
  longitude: numeric('longitude', { precision: 9, scale: 6 }).notNull(), // Increased scale for longitude
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
})
