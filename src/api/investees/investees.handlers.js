'use strict'

import mongoose from 'mongoose'

import * as cloudinary from 'cloudinary'

const Investees = mongoose.model('Investee')

// --------------------
export async function createInvestee (req, reply) {
  const { name, type, investedAt, disinvestedAt, category, websiteUrl, headquarters, description = {} } = req.body

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    const isExistingInvestee = await Investees.exists({ name })
    if (isExistingInvestee) return reply.conflict('Investee already exists.')

    const file = await req.file()
    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: 'cartera/investees'
    })

    const investee = new Investees({
      name,
      type,
      investedAt,
      disinvestedAt,
      category,
      websiteUrl,
      logoUrl: uploadResult.secure_url,
      headquarters,
      description,
    })

    await investee.save()

  } catch (err) {
    console.error(' !! Could not create investee', err)
    return reply.internalServerError(err)
  }
}
