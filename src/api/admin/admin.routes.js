import { createSysUser, getSysUser, updateSysUser } from './admin.handlers.js'

import { configAllowance } from '../../services/authorization.service.js'
import config from '../../config.js'

async function routes (fastify, opts) {
  // Set global authorization config.
  opts.config = configAllowance(config.roleGroups.admin)

  fastify.post('/', { ...opts }, createSysUser)
  fastify.get('/:userId', { ...opts }, getSysUser)
  fastify.put('/:userId', { ...opts }, updateSysUser)
}

export default routes
