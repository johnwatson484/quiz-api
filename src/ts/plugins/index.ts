import { Server } from '@hapi/hapi'
import logging from './logging.js'
import router from './router.js'

async function registerPlugins (server: Server): Promise<void> {
  const plugins: any[] = [
    logging,
    router,
  ]

  await server.register(plugins)
}

export { registerPlugins }
