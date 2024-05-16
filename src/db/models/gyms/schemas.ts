import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { coordinatesTable, gymsTable, locationsTable } from './tables'

// DaysOfWeek schema
const daysOfWeekSchema = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
const daysOfWeek = daysOfWeekSchema.options
// Define the schema for operating hours for a single day with custom validation
const dailyOperatingHoursSchema = z
  .object({
    isOpen: z.boolean(),
    open: z.union([z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'), z.null()]),
    close: z.union([z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'), z.null()]),
  })
  .refine(
    (data) => {
      if (!data.isOpen) {
        return data.open === null && data.close === null
      } else {
        return data.open !== null && data.close !== null
      }
    },
    {
      message:
        'If isOpen is false, both open and close should be null. If isOpen is true, both open and close should be valid time strings.',
      path: ['open', 'close'], // Specify the path to apply the error message to
    }
  )

// Create a schema for the entire week's operating hours dynamically
const operatingHoursSchema = z.object(
  daysOfWeek.reduce((acc, day) => {
    acc[day] = dailyOperatingHoursSchema
    return acc
  }, {} as Record<DaysOfWeek, typeof dailyOperatingHoursSchema>)
)

// Infer the TypeScript type from the Zod schema
type DaysOfWeek = z.infer<typeof daysOfWeekSchema>
export type OperatingHours = z.infer<typeof operatingHoursSchema>

// GYM
export const selectGymSchema = createSelectSchema(gymsTable)
export const insertGymSchema = createInsertSchema(gymsTable, {
  id: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  corporateMail: (schema) => schema.corporateMail.email({ message: 'Invalid email' }),
  name: z.string().min(3, 'Gym must have a name'),
  gymDescription: (schema) => schema.gymDescription.optional(),
  updatedAt: z.date().default(new Date()),
  needsCheckInValidation: z.boolean().default(false),
  corporatePhone: z.string(),
})
export const requestGymSchema = insertGymSchema.pick({
  name: true,
  gymDescription: true,
  corporateMail: true,
  corporatePhone: true,
  needsCheckInValidation: true,
})
export type Gym = z.infer<typeof insertGymSchema> & {
  id: string
  needsCheckInValidation: boolean
  createdAt: Date
  updatedAt: Date
}
export type GymRequest = z.infer<typeof requestGymSchema> & LocationRequest & CoordinatesRequest

// LOCATION
export const selectLocationSchema = createSelectSchema(locationsTable)
export const insertLocationSchema = createInsertSchema(locationsTable, {
  id: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  gymId: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  branchName: z.string().min(1, 'Branch name must exist'),
  branchMail: z.string().email({ message: 'Invalid email address' }),
  branchDescription: (schema) => schema.branchDescription.optional(),
  operatingHours: operatingHoursSchema,
  updatedAt: z.date().default(new Date()),
  branchPhone: z.string(),
})
export const requestLocationSchema = insertLocationSchema.pick({
  gymId: true,
  branchName: true,
  branchMail: true,
  branchPhone: true,
  operatingHours: true,
  branchDescription: true,
})
export type LocationRequest = z.infer<typeof requestLocationSchema> & CoordinatesRequest
export type Location = z.infer<typeof insertLocationSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

// COORDINATES
export const selectCoordinatesSchema = createSelectSchema(coordinatesTable)
export const insertCoordinatesSchema = createInsertSchema(coordinatesTable, {
  id: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  latitude: z
    .string()
    .min(1, 'Must enter a latitude')
    .regex(/^\d+(\.\d{1,6})?$/, 'Invalid numeric format'),
  longitude: z
    .string()
    .min(1, 'Must enter a latitude')
    .regex(/^\d+(\.\d{1,6})?$/, 'Invalid numeric format'),
})
export const requestCoordinatesSchema = insertCoordinatesSchema.pick({
  locationId: true,
  latitude: true,
  longitude: true,
})
export type CoordinatesRequest = z.infer<typeof requestCoordinatesSchema>
export type Coordinates = z.infer<typeof insertCoordinatesSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
}
