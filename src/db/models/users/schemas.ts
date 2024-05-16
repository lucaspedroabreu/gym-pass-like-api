// ZOD PARSING SCHEMAS

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { usersTable } from './tables'

// USER
export const selectUserSchema = createSelectSchema(usersTable)
export const insertUserSchema = createInsertSchema(usersTable, {
  id: z.string().min(1, { message: 'ID is required' }).uuid({ message: 'Invalid uuid v4 ' }),
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
    password: z.string().min(1, 'User should have a password').min(6, 'Password should have at least 6 digits'),
  })
export type UserInsert = z.infer<typeof insertUserSchema>
export type User = z.infer<typeof insertUserSchema> & { id: string; createdAt: Date; updatedAt: Date }
export type UserRequest = z.infer<typeof requestUserSchema>
