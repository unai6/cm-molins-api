'use strict'

import mongoose from 'mongoose'

import { uploadImage, deleteImage } from '../../services/utils.service.js'

const Investees = mongoose.model('Investee')

// --------------------
export async function createInvestee (req, reply) {
  try {
    const file = await req.file()

    const { investeeData, investeeFile } = file.fields

    if (!investeeData || !investeeFile) return reply.badRequest('Missing investee data or file.')

    const { name, type, investedAt, disinvestedAt, category, websiteUrl, headquarters, description = {} } = JSON.parse(file.fields?.investeeData?.value || '')

    const isExistingInvestee = await Investees.exists({ name })
    if (isExistingInvestee) return reply.conflict('Investee already exists.')

    const buffer = await file.fields.investeeFile.toBuffer()

    const folder = 'carteracm/investees'
    const uploadImageResult = await uploadImage(buffer, folder, investeeFile.filename)

    // await deleteImage(uploadImageResult.public_id)

    const investee = new Investees({
      name,
      type,
      investedAt,
      disinvestedAt,
      category,
      websiteUrl,
      logoUrl: uploadImageResult.secure_url,
      publicId: uploadImageResult.public_id,
      headquarters,
      description,
    })

    await investee.save()

    return investee

  } catch (err) {
    console.error(' !! Could not create investee', err)
    return reply.internalServerError(err)
  }
}

// --------------------
export async function deleteInvestee (req, reply) {
  try {
    const { investeeId } = req.params

    const investee = await Investees.findOneAndDelete({ _id: investeeId })
    if (!investee) return reply.notFound('Investee not found.')

    await deleteImage(investee.publicId)

    return { msg: 'Ok' }

  } catch (err) {
    console.error(' !! Could not delete investee', err)
    return reply.internalServerError(err)
  }
}
