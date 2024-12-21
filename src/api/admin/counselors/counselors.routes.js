async function routes (fastify, opts) {
  // Set global authorization config
  // opts.config = configAllowance(allow.admins)
  // // TODO: this is a temporary generic assigment of tags. To be completed in a granular, per route basis.
  // opts.schema = { tags: ['admin-coupons'] }

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
}

export default routes
