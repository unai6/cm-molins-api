import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import config from '../../config.js'

import { generateStrongPassword } from '../../services/utils.service.js'
import { sendCreateUserEmail } from '../../services/notification.service.js'

const SysUsers = mongoose.model('SysUser')
const UsersMetadata = mongoose.model('UserMetadata')

// --------------------
export async function createSysUser (req, reply) {
  const { email, givenName, familyName } = req.body
  if (!email) return reply.badRequest('Email and password are required.')

  const isExisingUser = await SysUsers.exists({ email })
  if (isExisingUser) return reply.conflict('User already exists.')

  const user = new SysUsers({
    email,
    givenName,
    familyName,
    country: 'es',
    role: 'admin'
  })

  await user.validate()

  const password = generateStrongPassword()

  const hash = await bcrypt.hash(password, 10)

  const payload = {
    sub: user._id,
  }

  const token = jwt.sign(payload, process.env.API_SECRET, { expiresIn: config.tokens.newSysUserTokenExpiration })

  const newUserMeta = new UsersMetadata({ _id: user._id, password: hash, verificationToken: token })

  await Promise.all([
    user.save(),
    newUserMeta.save(),
  ])

  await sendCreateUserEmail(user)

  return user
}


// --------------------
export async function getSysUser (req, reply) {
  const { userId } = req.params

  try {
    const user = await SysUsers.findById(userId).lean()
    if (!user) return reply.notFound('User not found.')

    return user
  } catch (err) {
    console.error(' !! Could not get sysUser', err)
    return reply.internalServerError(err)
  }
}


// --------------------
export async function updateSysUser (req, reply) {
  const { userId } = req.params
  const { givenName, familyName, email, isNotActive } = req.body

  const newData = {
    givenName,
    familyName,
    email,
    isNotActive,
  }

  try {
    const user = await SysUsers.findOneAndUpdate({ _id: userId }, { $set: newData }, { new: true })
    if (!user) return reply.notFound('User not found.')

    return user
  } catch (err) {
    console.error(' !! Could not update sysUser', err)
    return reply.internalServerError(err)
  }
}
