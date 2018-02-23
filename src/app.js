'use strict'

const fastify = require('fastify')()

fastify.register(require('./models/index'))

fastify.register(require('./router/index'))

fastify.listen(3000, function (err) {
  if (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
})
