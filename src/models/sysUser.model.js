const mongoose = require('mongoose')
const Schema = mongoose.Schema


const nanoid = require('nanoid')
const newId = nanoid.customAlphabet(config.nanoid.alphabet, config.nanoid.length)

const SysUserSchema = new Schema({
  _id: { type: String, default: () => newId() },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  lastSessionAt: { type: Date },
})
