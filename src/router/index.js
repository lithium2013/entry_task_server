const fastifyPlugin = require('fastify-plugin')
const baseUrl = '/api/v1/'

async function routes (fastify) {
  const { models } = fastify
  const controllers = (require('../controllers/index.js'))(models)
  const { userController } = controllers

  fastify.post(
    `${baseUrl}register`,
    userController.register
  )
}

module.exports = fastifyPlugin(routes)
