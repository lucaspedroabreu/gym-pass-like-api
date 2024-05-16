export class DbOperationError extends Error {
  public status: string
  public statusCode: number
  public name: string
  public message: string

  constructor() {
    super('Database operation failed')
    this.status = 'failure'
    this.statusCode = 417
    this.name = 'Expectation Failed'
    this.message = 'For unkown reasons the desired database operation failed to run!'
  }
}
