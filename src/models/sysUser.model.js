import { model, Schema } from 'mongoose'

import { customAlphabet } from 'nanoid'

import config from '../config.js'

const newId = customAlphabet(config.nanoid.alphabet, config.nanoid.length)

const SysUserSchema = new Schema({
  _id: { type: String, default: () => newId() },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  lastSessionAt: { type: Date },
})

export default model('SysUser', SysUserSchema)
