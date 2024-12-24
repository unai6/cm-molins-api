'use strict'

import axios from 'axios'
import streamifier from 'streamifier'
import { v2 as cloudinary } from 'cloudinary'
import { customAlphabet } from 'nanoid'

import config from '../config.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Password generation consts and function (defined here as it will be used extensively).
const numbers = '0123456789'
const alpha = 'abcdefghijklmnopqrstuvwxyz'
const upperCaseAlpha = alpha.toUpperCase()
const specialChars = '!@#&'
const allChars = numbers + alpha + upperCaseAlpha + specialChars
const newPassword = customAlphabet(allChars, 12)

export async function sendNotificationEmail (emailData, options = { isNoReply: false, template: 'default' }) {
  // If this is a test email, don't send it.
  const dummyDomains = ['test.com', 'test.es', 'test.fr', 'prueba.es', 'prueba.com']
  if (dummyDomains.includes(emailData.email.split('@')[1])) {
    return null
  }

  const { email: emailTo, name: nameTo, familyName: familyNameTo, subject: emailSubject, ...params } = emailData

  const subjectPrefix = process.env.NODE_ENV !== 'production' ? 'TEST - ' : ''

  try {
    const { data } = await axios.post(config.brevo.endpoint, {
      sender: { name: 'Cartera C.M', email: 'unaigoe91@gmail.com' },
      replyTo: { name: 'Cartera C.M', email: 'unaigoe91@gmail.com' },
      to: [{ email: emailTo, name: nameTo }],
      templateId: config.brevo.template.notification,
      params: { items: [{ ...params, name: nameTo, familyName: familyNameTo }]},
      subject: `${subjectPrefix}${emailSubject}`,
    },
    {
      headers: {
        'api-key': `${process.env.BREVO_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    return data
  } catch (error) {
    console.error('  !! Error sending notification email')
    console.error('         status:', err.response?.status)
    console.error('     statusText:', err.response?.statusText, '\n')
    throw err
  }
}

// --------------------
export function generateStrongPassword () {
  let password = newPassword()
  // A bit of a brute force approach, but we're using it for the sake of code simplicity.
  while (!config.strongPassword.test(password)) {
    password = newPassword()
  }

  return password
}

// --------------------
export async function uploadImage (buffer, folder, imageName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        upload_preset: 'ml_default',
        public_id: imageName,
      },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      },
    )

    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}

// --------------------
export async function deleteImage (publicId) {
  const result = await cloudinary.uploader.destroy(publicId)

  return result
}