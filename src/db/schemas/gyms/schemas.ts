import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { gyms } from './tables'

export type DaysOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type OperatingHours = {
  [key in DaysOfWeek]: {
    isOpen: boolean
    open: string // Assuming time format like "09:00 AM"
    close: string // Assuming time format like "05:00 PM"
  }
}

// GYM
export const selectGymSchema = createSelectSchema(gyms)
export const insertGymSchema = createInsertSchema(gyms, {
  id: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  corporateMail: (schema) => schema.corporateMail.email({ message: 'Invalid email' }),
  name: z.string().min(3, 'Gym must have a name'),
  description: (schema) => schema.description.optional(),
  updatedAt: z.date().default(new Date()),
})
export const requestGymSchema = insertGymSchema.pick({
  name: true,
  description: true,
})
export type GymInsert = z.infer<typeof insertGymSchema>
export type GymRequest = z.infer<typeof insertGymSchema>
