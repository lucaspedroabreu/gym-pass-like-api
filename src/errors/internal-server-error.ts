export class InternalServerError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  constructor() {
    super('Internal Server Errro')
    this.status = 'unexpected error'
    this.statusCode = 500
    this.name = 'InternalServerError'
    this.message = 'The server should have delt with this error!'
  }
}
