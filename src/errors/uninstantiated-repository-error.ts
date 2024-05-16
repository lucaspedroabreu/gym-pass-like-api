export class UninstantiatedRepositoryError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  constructor() {
    super('Internal Server Errro')
    this.status = 'instantiation error'
    this.statusCode = 500
    this.name = 'UninstantiatedRepositoryError'
    this.message = 'The repository you are trying to access have not being instantiated by the server'
  }
}
