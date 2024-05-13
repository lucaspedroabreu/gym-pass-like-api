// ZOD PARSING SCHEMAS

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { users } from './tables'

// USER
export const selectUserSchema = createSelectSchema(users)
export const insertUserSchema = createInsertSchema(users, {
  id: z.string().uuid({ message: 'Invalid uuid v4 ' }),
  email: z.string().email({ message: 'Invalid email' }),
  name: z.string().min(3, 'User must have a name'),
  updatedAt: z.date().default(new Date()),
  passwordHash: z.string(),
})
export const requestUserSchema = insertUserSchema
  .pick({
    email: true,
    name: true,
  })
  .extend({
    password: z.string().min(1, 'User should have a password'),
  })
export type UserInsert = z.infer<typeof insertUserSchema>
export type UserRequest = z.infer<typeof requestUserSchema>
