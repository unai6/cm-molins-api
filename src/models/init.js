'use strict'

const fs = require('fs')

const modelFileList = fs.readdirSync('./src/models/').filter(fn => fn.endsWith('.model.js'))

module.exports = function () {
  for (const model of modelFileList) {
    if (process.env.NODE_ENV === 'development') console.info('Initializing:', model)
    require(`${__dirname}/${model}`)
  }
}
