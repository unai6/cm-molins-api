import { model, Schema } from 'mongoose'

import { customAlphabet } from 'nanoid'

import config from '../config.js'

const newId = customAlphabet(config.nanoid.alphabet, config.nanoid.length)

const InvesteeSchema = new Schema({
  _id: { type: String, default: () => newId() },
  name: { type: String, required: true },
  type: { type: String, required: true },
  investedAt: { type: String, required: true },
  disinvestedAt: { type: String },
  category: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  logoUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  headquarters: { type: String, required: true },
  description: {
    es: { type: String, required: true },
    en: { type: String, required: true },
    ca: { type: String, required: true },
  },
})

export default model('Investee', InvesteeSchema)
