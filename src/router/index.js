'use strict'

const routes = async fastify => {
  const { models } = _pangolier
  const controllers = (require('../controllers/index.js'))(models)
  const {
    authController,
    eventController,
    channelController
  } = controllers

  // User auth
  fastify.post('/join', authController.register)
  fastify.post('/auth/token', authController.auth)
  fastify.delete('/auth/token', authController.unauth)

  // Channel
  fastify.get('/channels', channelController.getChannels)

  // Event
  fastify.get('/events', eventController.getEventsByQuery)
  fastify.get('/events/:eventId', eventController.getEventById)

  fastify.get('/events/:eventId/participants', eventController.getEventParticipants)
  fastify.post('/events/:eventId/participants', eventController.participateEvent)
  fastify.delete('/events/:eventId/participants', eventController.leaveEvent)

  fastify.post('/events/:eventId/like', eventController.likeEvent)
  fastify.delete('/events/:eventId/like', eventController.unlikeEvent)
}

module.exports = routes
