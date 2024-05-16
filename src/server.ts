import cors from '@fastify/cors'

import { app } from './app'
import { env } from './env'
import routes from './http/routes'

app.register(cors, {
  origin: '*',
})

const startServer = async () => {
  try {
    await app.register(routes, { prefix: '/api' })

    app.listen({ port: env.SERVER_PORT }, (err, address) => {
      if (err) {
        throw err
      }
      app.log.info(`Server running...`)
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startServer()
