const mongoose = require('mongoose')
const path = require('path')
const autoload = require('@fastify/autoload')
// const tokenHandlers = require('./shared/token.handlers')
// const authorizationService = require('./services/authorization.service')
// const initModels = require('./models/init')
const pinostackdriver = require('@binxhealth/pino-stackdriver')
const createStream = pinostackdriver.createStream
const packageInfo = require('../package.json')

const config = require('./config')


// Fastify options
let fastifyOptions
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  fastifyOptions = {
    disableRequestLogging: true,
    logger: {
      level: 'info',
      stream: createStream(),
    },
    ignoreTrailingSlash: true,
  }
} else {
  console.info('Setting logging options with ALL levels.')
  fastifyOptions = {
    logger: true,
    ignoreTrailingSlash: true,
  }
}

// Require the framework and instantiate it.
const fastify = require('fastify')(fastifyOptions)

fastify
  .register(require('@fastify/cors'), {})
  .register(require('@fastify/helmet'))
  .register(require('@fastify/sensible'))
  .register(require('@fastify/multipart'), {
    // Multipart is required to upload files.
    limits: {
      fieldNameSize: 100, // Max field name size in bytes.
      fieldSize: 1000000, // Max field value size in bytes.
      fields: 10, // Max number of non-file fields.
      fileSize: 100000, // For multipart forms, the max file size.
      files: 1, // Max number of file fields.
      headerPairs: 1000, // Max number of header key=>value pairs.
    },
  })

fastify.ready(err => {
  if (!err) {
    if (process.env.NODE_ENV === 'development') {
      // authorizationService.logTokens(fastify)
      console.info('Tokens are logged.')
    }
  } else {
    console.info('Fastify init error', err)
  }
})

// Add global Hooks
// fastify.addHook('onRequest', tokenHandlers.verifyToken)
// fastify.addHook('onRequest', tokenHandlers.authorize)


// Register all services in 'api' folder (recursively).
fastify.register(autoload, {
  dir: path.join(__dirname, 'api'),
  options: { prefix: config.apiPrefix[process.env.NODE_ENV] },
  matchFilter: (path) => path.endsWith('.routes.js'),
})

const gracefulExit = async function () {
  console.info('  >> Graceful exit. Mongoose connection status:', mongoose.connection.readyState)
  if (mongoose.connection.readyState === 1) {
    // This means that the connection is established and we can safely close it.
    console.info('     Closing Mongoose connection...')
    await mongoose.connection.close()
    console.info('     Mongoose DB connection is now disconnected through app termination.')
  }
  console.info('  >> Exiting process...')
  process.exit(0)
}
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit).on('exit', gracefulExit)

module.exports = fastify
