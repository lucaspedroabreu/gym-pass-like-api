import { relations } from 'drizzle-orm/relations'
import { coordinatesTable, gymsTable, locationsTable } from './tables'

// RELATIONSHIPS SCHEMAS
export const coordinatesTableRelations = relations(coordinatesTable, ({ one }) => ({
  belongsTo: one(locationsTable, {
    fields: [coordinatesTable.locationId],
    references: [locationsTable.id],
  }),
}))
export const locationsTableRelation = relations(locationsTable, ({ one }) => ({
  belongsTo: one(gymsTable, {
    fields: [locationsTable.gymId],
    references: [gymsTable.id],
  }),
}))
export const gymsTableRelations = relations(gymsTable, ({ many }) => ({
  locations: many(locationsTable),
}))
