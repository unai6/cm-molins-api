import mongoose from 'mongoose'

import { sendNotificationEmail } from './utils.service.js'

const UsersMetadata = mongoose.model('UserMetadata')

// --------------------
export async function sendRequestResetPasswordEmail (userData, token, baseUrl) {
  try {
    // Only send the central part of the token (the payload).
    const tokenPayload = token.split('.')[1]

    const locale = userData.country || 'es'

    const emailData = {
      name: userData.givenName,
      email: userData.email,
      locale,
      subject: 'Subject',
      greeting: 'Greeting',
      body: 'body',
      ctaLink: `${baseUrl}/newpassword?email=${userData.email}&key=${tokenPayload}&lang=${locale}`,
      ctaText: 'cta text',
    }

    await sendNotificationEmail(emailData)
  } catch (err) {
    console.error(`  !! Could not send request reset password email to ${userData.email}`, err)
  }
}


export async function sendCreateUserEmail (userData) {
  const locale = userData.country || 'es'

  try {
    const { verificationToken } = await UsersMetadata.findOne({ _id: userData._id }).select('+verificationToken').lean()
    if (!verificationToken) {
      console.error(' !! Verification token not found for:', userData.email)
      return
    }

    const emailData = {
      name: userData.givenName,
      email: userData.email,
      locale,
      subject: 'Subject',
      greeting: 'Greeting',
      body: 'body',
      ctaText: 'cta text',
    }

    await sendNotificationEmail(emailData)

  } catch (err) {
    console.error(err)
  }
}
