import { configAllowance } from '../../services/authorization.service.js'
import config from '../../config.js'

async function routes (fastify, opts) {
  // Set global authorization config.
  opts.config = configAllowance(config.roleGroups.admin)

  fastify.post('/', async (request, reply) => {
    return { hello: 'world' }
  })
}

export default routes
