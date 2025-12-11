import { Server, ServerRoute, ServerOptions, Plugin } from '@hapi/hapi'
import health from '../routes/health.js'

const plugin: Plugin<ServerOptions> = {
  name: 'router',
  register: (server: Server, _options: ServerOptions) => {
    server.route(new Array<ServerRoute>().concat(
      health
    ))
  },
}

export default plugin
