import { relations } from 'drizzle-orm/relations'
import { coordinatesTable, gyms, locations } from './tables'

// RELATIONSHIPS SCHEMAS
export const coordinatesTableRelations = relations(coordinatesTable, ({ one }) => ({
  belongsTo: one(locations, {
    fields: [coordinatesTable.locationId],
    references: [locations.id],
  }),
}))
export const locationsTableRelation = relations(locations, ({ one }) => ({
  gym: one(gyms, {
    fields: [locations.gymId],
    references: [gyms.id],
  }),
}))
export const gymsTableRelations = relations(gyms, ({ many }) => ({
  locations: many(locations),
}))
