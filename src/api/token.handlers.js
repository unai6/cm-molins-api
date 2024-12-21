'use strict'

import jwt from 'jsonwebtoken'

const DEFAULT_REASON = 'Access not authorized.'

// --------------------
export async function verifyToken (req, reply) {
  // All requests go through this hook. If the token is not valid or doesn't have a role, it is rejected.
  // If it is valid, data is extracted from it and added to the req object for subsequent calls.
  try {

    // Do not verify token if explicitly specified as verifyToken is set as global hook and some endpoint requests do not require token.
    if (req.routeOptions.config?.verifyToken === false) return

    // The authorization header contains 'Bearer <token>' so we need to extract the actual jwtToken from that string.
    const jwtToken = req.headers.authorization?.split(' ')[1]
    const decodedToken = jwt.verify(jwtToken, process.env.API_SECRET)

    // Refresh tokens don't have roles -- this prevents using RT's for accessing the API.
    if (!decodedToken.role) return reply.unauthorized()

    req.user = {
      id: decodedToken.sub,
      role: decodedToken.role,
    }
  } catch (err) {
    return reply.unauthorized()
  }
}


// --------------------
export function authorize (req, reply) {
  const { role: authorizedRole = [], reason } = req.routeOptions.config?.authorize || {}
  const userRole = req.user?.role|| []

  // If authorizedRole only contains '*', always allow the request.
  if (authorizedRole === '*') return

  if (userRole !== authorizedRole) {
    req.log.warn(reason || DEFAULT_REASON)
    reply.forbidden()
    return reply
  }
}
