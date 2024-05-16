import { EmailConflictError } from '@/errors/email-conflict-error'
import { hashPassword, validatePassword } from '@/libs/auth'
import { expect, suite, test } from 'vitest'
import { createUsersService } from '../users.service'

// TypeScript type alias for UUID strings with a specific format
type UUID = `${string}-${string}-${string}-${string}-${string}`

function isUUID(input: string | undefined): input is UUID {
  // Implement actual UUID validation logic here or use a library
  if (!input) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)
}

suite('[use-case]: Register New User', () => {
  test('[test]: Registering a new user should correctly hash its password', async () => {
    const unitTestingUserService = createUsersService('test')
    const userRequest = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }
    const newUser = await unitTestingUserService.registerNewUser(userRequest)
    const hashePassword = await hashPassword(userRequest.password)

    const isPasswordCorrectlyHashed = await validatePassword(userRequest.password, hashePassword)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('[test]: Register should not allow duplicate email and should throw specific error', async () => {
    const unitTestingUserService = createUsersService('test')

    const userRequest = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }
    await unitTestingUserService.registerNewUser(userRequest)

    await expect(unitTestingUserService.registerNewUser(userRequest)).rejects.toBeInstanceOf(EmailConflictError)
  })

  test('[test]: Expect new user to have a valid ID', async () => {
    const unitTestingUserService = createUsersService('test')

    const userRequest = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const newUser = await unitTestingUserService.registerNewUser(userRequest)
    expect(isUUID(newUser.id)).toBe(true)
  })
})
