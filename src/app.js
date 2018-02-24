'use strict'
const fs = require('fs')

const yaml = require('js-yaml')
const fastify = require('fastify')()
const cookieParser = require('cookie-parser')

const models = require('./models/index')
const router = require('./router/index')

const config = yaml.safeLoad(fs.readFileSync('./config.yml'))
console.log(config)

fastify.register(models)

fastify.use('/', cookieParser())
fastify.register(router, { prefix: '/api/v1' })

fastify.listen(config.port, err => {
  if (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
})
