import { Server, ServerRoute, ServerOptions, Plugin } from '@hapi/hapi'
import home from '../routes/home.js'
import assets from '../routes/assets.js'
import health from '../routes/health.js'

const plugin: Plugin<ServerOptions> = {
  name: 'router',
  register: (server: Server, _options: ServerOptions) => {
    server.route(new Array<ServerRoute>().concat(
      home,
      assets,
      health
    ))
  },
}

export default plugin
