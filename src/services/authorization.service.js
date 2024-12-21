'use strict'

import jwt from 'jsonwebtoken'

// --------------------
export function configAllowance ({ role, reason }) {
  return { authorize: { role, reason } }
}

// --------------------
export function logTokens () {
  const payload = {
    sub: 'apikey01',
    role: 'guest',
  }
  const options = {
    algorithm: 'HS256',
    noTimestamp: true,
  }

  // Guest token
  const token = jwt.sign(payload, process.env.API_SECRET, options)
  console.info('----------')
  console.info('Guest token:')
  console.info(token)
  console.info(jwt.decode(token, process.env.API_SECRET))
  console.info('----------')
}
