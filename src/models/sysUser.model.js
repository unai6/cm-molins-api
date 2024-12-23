import { model, Schema } from 'mongoose'

import { customAlphabet } from 'nanoid'

import config from '../config.js'

const newId = customAlphabet(config.nanoid.alphabet, config.nanoid.length)

const SysUserSchema = new Schema({
  _id: { type: String, default: () => newId() },
  givenName: { type: String, required: true },
  familyName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  country: { type: String, required: true },
  role: { type: String, required: true },
  isNotActive: { type: Boolean },
  lastSessionAt: { type: Date },
},
{
  collection: 'sysusers',
  timestamps: true,
  // User info is important -- specify write concern of 'majority'.
  writeConcern: { w: 'majority', j: true, wtimeout: 5000 },
  versionKey: false,
  id: false, // No additional id as virtual getter.
  toJSON: { versionKey: false, virtuals: true },
  toObject: { versionKey: false },
})

export default model('SysUser', SysUserSchema)
