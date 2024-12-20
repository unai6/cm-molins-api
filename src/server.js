const mongoose = require('mongoose')

// Run the server
async function start () {
  try {
    // Connect to MongoDB first.
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.MONGODB_URL, { autoIndex: false })
    console.info('\n==> Connected to MongoDB.\n')

    // Since fastifyApp requires the connection to MongoDB to be established, we require it here exceptionally.
    const fastifyApp = require('./app')

    // Then start listening on the specific port.
    await fastifyApp.listen({ port: process.env.PORT || 80 })
    if (process.env.NODE_ENV === 'development') {
      fastifyApp.log.info('\n' + fastifyApp.printRoutes({ commonPrefix: false }))
    }
    console.info(
      '\n===========================================================================' +
      `\n CM API ready / Port: ${fastifyApp.server.address().port} / NODE_ENV: ${process.env.NODE_ENV} / Fastify v.${fastifyApp.version}` +
      '\n===========================================================================',
    )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = { start }
