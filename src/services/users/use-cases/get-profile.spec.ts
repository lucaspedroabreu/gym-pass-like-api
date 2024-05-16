import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { randomUUID } from 'node:crypto'
import { expect, suite, test } from 'vitest'
import { createUsersService } from '../users.service'

suite('[use-case]: Get User Profile', () => {
  test('[test]: Should be able to fetch users profile', async () => {
    const unitTestingUserService = createUsersService('test')
    const firstUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const registeredUser = await unitTestingUserService.registerNewUser(firstUser)
    expect(registeredUser).toBeTruthy()

    const userProfile = await unitTestingUserService.getUserProfile(registeredUser.id)

    expect(userProfile).toStrictEqual(registeredUser)
  })

  test('[test]: Not be able to get user profile with wrong id', async () => {
    const unitTestingUserService = createUsersService('test')
    const firstUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const registeredUser = await unitTestingUserService.registerNewUser(firstUser)
    expect(registeredUser).toBeTruthy()

    await expect(async () => {
      await unitTestingUserService.getUserProfile(randomUUID())
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
