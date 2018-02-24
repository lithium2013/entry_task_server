'use strict'

const routes = async fastify => {
  const { models } = fastify
  const controllers = (require('../controllers/index.js'))(models)
  const { userController, eventController } = controllers

  fastify.post('/register', userController.register)
  fastify.post('/login', userController.login)
  fastify.post('/users', userController.getUsers)

  fastify.post('/events', eventController.getEventsByIds)
  fastify.get('/query/events', eventController.getEventsByQuery)

  fastify.post('/events/:event_id/join', eventController.joinEvent)
  fastify.delete('/events/:event_id/join', eventController.leaveEvent)

  fastify.post('/events/:event_id/like', eventController.likeEvent)
  fastify.delete('/events/:event_id/like', eventController.unlikeEvent)
}

module.exports = routes
