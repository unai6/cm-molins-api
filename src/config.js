const config = {
  //Tokens
  tokens: {
    accessTokenExpiration: '45 minutes',
    refreshTokenExpiration: '30 days',
  },
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
  },
  roleList: ['admin', 'counselor'], // Ordered by hierarchy.
  roleGroups: {
    guest: { role: 'guest' },
    authenticated: { role: 'authenticated', reason: 'allowAuthenticatedOnly -- Access not authorized' },
    admin: { role: 'admin', reason: 'allowAdminsOnly -- Access not authorized' },
    counselor: { role: 'counselor', reason: 'allowCounselorsOnly -- Access not authorized' },
  },
  //Mailing
  brevo: {
    endpoint: 'https://api.brevo.com/v3/smtp/email',
    template: {
      notification: 1,
    }
  },
}

export default config
