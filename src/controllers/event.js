'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { send400, send403, send404 } = _pangolier.utils
const {
  User,
  Event,
  Like,
  Participation
} = _pangolier.getModels()

const getEventById = async (request, reply) => {
  const eid = request.params.eventId
  const event = await Event.findOne({
    where: { id: eid }
  })
  const { isAuthed } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  if (event) {
    return reply.send({
      event: event.dataValues
    })
  }

  send404(reply, 'event_not_found')
}

const getEventsByQuery = async (request, reply) => {
  let {
    after,
    before,
    channels,
    offset,
    limit
  } = request.query
  const { isAuthed } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  channels = channels && channels.split(',')
  offset = parseInt(offset) || 0
  limit = parseInt(limit)

  const query = {}
  let events, hasMore

  if (channels) query.channel_id = channels
  if (after) query.begin_time = { [Op.gte]: parseInt(after) }
  if (before) query.end_time = { [Op.lte]: parseInt(before) }

  const { count, rows } = await Eventl.findAndCountAll({
    where: query,
    offset,
    limit
  })

  events = rows.map(item => item.dataValues)
  hasMore = limit !== undefined && count > offset + limit

  reply.send({ events, hasMore })
}

const getEventParticipants = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const event = await Event.findOne({
    where: { id: eid },
    include: [{
      model: User
    }]
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  reply.send({ users: event.users })
}

const participateEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const user = await User.findOne({ where: { id: uid } })
  const event = await Event.findOne({
    where: { id: eid },
    include: [{
      model: User,
      through: {
        where: { userId: uid }
      }
    }]
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  if (event.users.length) {
    return send403(reply, 'already_joined')
  }

  await event.addUser(user, { through: Participation })
  await event.save()

  reply.send()
}

const leaveEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const user = await User.findOne({ where: { id: uid } })
  const event = await Event.findOne({
    where: { id: eid },
    include: [{
      model: User,
      through: {
        where: { userId: uid }
      }
    }]
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  if (!event.users.length) {
    return send404(reply, 'no_participation_record_found')
  }

  await event.removeUser(user)

  reply.send()
}

const likeEvent = async (request, reply) => {
  const eid = request.params.eventId
  const cookies = request.req.cookies
  const uid = cookies && cookies.userId

  if (!uid) {
    return reply
      .code(403)
      .send({ error: 'user_not_login' })
  }

  const count = await Like.count({
    where: {
      userId: uid,
      eventId: eid
    }
  })

  if (count) {
    return reply
      .code(403)
      .send({ error: 'already_liked' })
  }

  const eventLike = {
    userId: uid,
    eventId: eid,
    like_time: Date.now()
  }

  await Like.create(eventLike)

  reply.send(eventLike)
}

const unlikeEvent = async (request, reply) => {
  const eid = request.params.eventId
  const uid = request.req.cookies.userId
  const where = {
    userId: uid,
    eventId: eid
  }

  if (!uid) {
    return reply
      .code(403)
      .send({ error: 'user_not_login' })
  }

  const eventLike = await Like.findOne({ where })

  if (eventLike === null) {
    return reply
      .code(403)
      .send({ error: 'could not unlike event not liked yet' })
  }

  await eventLike.destroy({ where })

  reply.send(eventLike)
}

module.exports = {
  getEventById,
  getEventsByQuery,
  getEventParticipants,
  participateEvent,
  leaveEvent,
  likeEvent,
  unlikeEvent
}
