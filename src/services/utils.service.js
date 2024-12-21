import axios from 'axios'

import config from '../config.js'

export async function sendNotificationEmail (emailData, options = { isNoReply: false, template: 'default' }) {
  // If this is a test email, don't send it.
  const dummyDomains = ['test.com', 'test.es', 'test.fr', 'prueba.es', 'prueba.com']
  if (dummyDomains.includes(emailData.email.split('@')[1])) {
    return null
  }

  const { email: emailTo, name: nameTo, subject: emailSubject, ...params } = emailData

  const subjectPrefix = process.env.NODE_ENV !== 'production' ? 'TEST - ' : ''

  try {
    const { data } = await axios.post(config.brevo.endpoint, {
      sender: { name: 'Cartera C.M', email: 'unaigoe91@gmail.com' },
      replyTo: { name: 'Cartera C.M', email: 'unaigoe91@gmail.com' },
      to: [{ email: emailTo, name: nameTo }],
      templateId: config.brevo.template.notification,
      params,
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
