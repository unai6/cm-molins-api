import { createInvestee, deleteInvestee, getInvestees } from './investees.handlers.js'

import { configAllowance } from '../../services/authorization.service.js'
import config from '../../config.js'

async function routes (fastify, opts) {
  // Set global authorization config.
  opts.config = configAllowance(config.roleGroups.admin)

  fastify.get('/', { ...opts }, getInvestees)
  fastify.post('/', { ...opts }, createInvestee)
  fastify.delete('/:investeeId', { ...opts }, deleteInvestee)
}

export default routes
