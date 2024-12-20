const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nanoid = require('nanoid')
const newId = nanoid.customAlphabet(config.nanoid.alphabet, config.nanoid.length)

const InvesteeSchema = new Schema({
  _id: { type: String, default: () => newId() },
  name: { type: String, required: true },
  type: { type: String, required: true },
  investedAt: { type: String, required: true },
  disinvestedAt: { type: String },
  category: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  logoUrl: { type: String, required: true },
  headquarters: { type: String, required: true },
  description: {
    es: { type: String, required: true },
    en: { type: String, required: true },
    ca: { type: String, required: true },
  },
})

module.exports = mongoose.model('Investee', InvesteeSchema)
