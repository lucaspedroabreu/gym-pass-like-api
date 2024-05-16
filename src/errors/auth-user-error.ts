export class AuthError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  // constructor overlaods
  constructor()
  constructor(type: 'authorization')

  // constructor implementations
  constructor(type: 'authorization' | undefined = undefined) {
    if (type === 'authorization') {
      super('AuthError')
      this.status = 'Unauthorized'
      this.statusCode = 401
      this.name = 'AuthError'
      this.message = 'You are not authorized to do this action'
    } else {
      super('AuthError')
      this.status = 'Bad Request'
      this.statusCode = 400
      this.name = 'AuthError'
      this.message = 'Invalid credentials.'
    }
  }
}
