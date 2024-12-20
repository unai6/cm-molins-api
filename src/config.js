const config = {
// API prefix depending on environment
  apiPrefix: {
    development: '/api-v1',
    staging: '/v1',
    production: '/v1',
  },
  // Nanoid-related
  nanoid: {
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    maxRetries: 5,
    length: 10,
    extendedLength: 12,
    // See collision potential, for reference: https://zelark.github.io/nano-id-cc/
    readable: {
      length: 10,
      alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
  }
}

export default config
