'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
const serveStatic = require('serve-static')
const path = require('path')
const fastify = require('fastify')({ logger: true })

const models = require('./models/index')
const router = require('./router/index')

global._pangolier = {
  token: require('./helper/token'),
  utils: require('./helper/utils')
}

const config = yaml.safeLoad(fs.readFileSync('./config.yml'))

fastify.register(models)

// Parse token
fastify.use('/', (req, res, next) => {
  const token = req.headers['x-blackcat-token']
  const uid = _pangolier.token.getUid(token)

  req.userStatus = { token, uid, isAuthed: Boolean(uid) }
  next()
})

// For test
fastify.use('/test', serveStatic(path.join(__dirname, '/test')))

fastify.register(router, { prefix: '/api/v1' })

fastify.listen(config.port, err => {
  if (err) {
    console.log('err', err)
    fastify.log.error(err)
    process.exit(1)
  }
})
