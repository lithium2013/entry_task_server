'use strict'

const fastify = require('fastify')()
const cookieParser = require('cookie-parser')
const models = require('./models/index')
const router = require('./router/index')

fastify.register(models)

fastify.use('/', cookieParser())
fastify.register(router, { prefix: '/api/v1' })

fastify.listen(3000, err => {
  if (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
})
