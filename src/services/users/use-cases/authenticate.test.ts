import { AuthError } from '@/errors/auth-user-error'
import { expect, suite, test } from 'vitest'
import { createUsersService } from '../users.service'

suite('[use-case]: Authenticate User', () => {
  test('[test]: User should be able to authenticate', async () => {
    const unitTestingUserService = createUsersService('test')
    const firstUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const user = await unitTestingUserService.registerNewUser(firstUser)
    expect(user).toBeTruthy()

    const authenticatedUser = await unitTestingUserService.authenticateUser({
      email: firstUser.email,
      password: firstUser.password,
    })

    expect(authenticatedUser).toStrictEqual(user)
  })

  test('[test]: Wrong e-mail shouldnt authenticate', async () => {
    const unitTestingUserService = createUsersService('test')
    const firstUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const authRequest = {
      email: 'wrong-johndoe@gmail.com',
      password: 'example123',
    }

    const user = await unitTestingUserService.registerNewUser(firstUser)
    expect(user).toBeTruthy()

    await expect(unitTestingUserService.authenticateUser(authRequest)).rejects.toBeInstanceOf(AuthError)
  })

  test('[test]: Wrong password shouldnt authenticate', async () => {
    const unitTestingUserService = createUsersService('test')
    const firstUser = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'example123',
    }

    const authRequest = {
      email: firstUser.email,
      password: 'example1234',
    }

    const user = await unitTestingUserService.registerNewUser(firstUser)
    expect(user).toBeTruthy()

    await expect(unitTestingUserService.authenticateUser(authRequest)).rejects.toBeInstanceOf(AuthError)
  })
})
