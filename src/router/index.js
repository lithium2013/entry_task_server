'use strict'

const routes = async fastify => {
  const { models } = fastify
  const controllers = (require('../controllers/index.js'))(models)
  const {
    userController,
    eventController,
    channelController
  } = controllers

  // User auth
  fastify.post('/join', userController.register)
  fastify.post('/auth/token', userController.auth)
  fastify.delete('/auth/token', userController.unauth)

  // Channel
  fastify.get('/channels', channelController.getChannels)

  fastify.post('/events', eventController.getEventsByIds)
  fastify.get('/query/events', eventController.getEventsByQuery)

  fastify.post('/events/:event_id/join', eventController.joinEvent)
  fastify.delete('/events/:event_id/join', eventController.leaveEvent)

  fastify.post('/events/:event_id/like', eventController.likeEvent)
  fastify.delete('/events/:event_id/like', eventController.unlikeEvent)
}

module.exports = routes
