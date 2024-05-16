export class ResourceNotFoundError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  constructor() {
    super('Resource Not Found')
    this.status = 'not found'
    this.statusCode = 404
    this.name = 'ResourceNotFoundError'
    this.message = 'The resource you are trying to fetch was not found!'
  }
}
