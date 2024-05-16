export class EmailConflictError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  constructor() {
    super('Email already registered')
    this.status = 'conflict'
    this.statusCode = 409
    this.name = 'DatabaseConflictError'
    this.message = 'Email already registered!'
  }
}
