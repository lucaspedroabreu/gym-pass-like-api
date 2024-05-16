// ZOD PARSING SCHEMAS
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { checkIns } from './tables'

// CheckIns
export const selectCheckInSchema = createSelectSchema(checkIns)
export const insertCheckInSchema = createInsertSchema(checkIns, {
  id: z.string().min(1, { message: 'ID is required' }).uuid({ message: 'Invalid uuid v4 ' }),
  locationId: z.string().min(1, { message: 'ID is required' }).uuid({ message: 'Invalid uuid v4 ' }),
  userId: z.string().min(1, { message: 'ID is required' }).uuid({ message: 'Invalid uuid v4 ' }),
  validatedAt: z.date().or(z.null()).default(null),
})
export const requestCheckInSchema = insertCheckInSchema.pick({
  locationId: true,
  userId: true,
})
export type CheckInInsert = z.infer<typeof insertCheckInSchema>
export type CheckIn = z.infer<typeof insertCheckInSchema> & { id: string; createdAt: Date }
export type CheckInRequest = z.infer<typeof requestCheckInSchema>
