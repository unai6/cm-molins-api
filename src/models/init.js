'use strict'

import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const modelFileList = fs.readdirSync('./src/models/').filter(fn => fn.endsWith('.model.js'))

export default async function () {
  for (const model of modelFileList) {
    if (process.env.NODE_ENV === 'development') console.info('Initializing:', model)
    await import(resolve(__dirname, model))
  }
}
