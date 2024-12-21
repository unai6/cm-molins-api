'use strict'

import mongoose from 'mongoose'

import * as cloudinary from 'cloudinary'

const Investees = mongoose.model('Investee')

// --------------------
async function createInvestee (req, reply) {
  const { name, type, investedAt, disinvestedAt, category, websiteUrl, headquarters, description = {} } = req.body
  // const { es, en, ca } = description
  try {
    const isExistingInvestee = await Investees.exists({ name })
    if (isExistingInvestee) return reply.conflict('Investee already exists.')


    const parts = req.parts()
    let logoUrl

    for (const part of parts) {
      if (part.file) {
        const formData = new FormData()
        formData.append('file', part.file, { filename: part.filename })
      }
    }

    const investee = new Investees({
      name,
      type,
      investedAt,
      disinvestedAt,
      category,
      websiteUrl,
      headquarters,
      description,
    })

  } catch (err) {
    console.error(' !! Could not create investee', err)
    return reply.internalServerError(err)
  }
}
