'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const eventController = models => {
  const {
    eventModel,
    eventLikeModel,
    participationModel
  } = models

  const getEventsByIds = async (request, reply) => {
    const eids = request.body.event_ids
    const events = await eventModel.findAll({
      where: { id: eids }
    })

    reply.send({
      events: events.map(item => item.dataValues)
    })
  }

  const getEventsByQuery = async (request, reply) => {
    const cid = request.query.category_id
    const fromTs = parseInt(request.query.from_time)
    const toTs = parseInt(request.query.to_time)
    const query = {}
    let events

    if (!cid && !fromTs && !toTs) events = []
    else {
      if (cid) query.category_id = cid
      if (fromTs) query.event_start_time = { [Op.gte]: fromTs }
      if (toTs) query.event_start_time = { [Op.lte]: toTs }

      events = await eventModel.findAll({ where: query })
      events = events.map(item => item.dataValues.id)
    }

    reply.send({ event_ids: events })
  }

  const joinEvent = async (request, reply) => {
    const eid = request.params.event_id
    const cookies = request.req.cookies
    const uid = cookies && cookies.user_id

    if (!uid) {
      return reply
        .code(403)
        .send({ error: 'user_not_login' })
    }

    const count = await participationModel.count({
      where: {
        user_id: uid,
        event_id: eid
      }
    })

    if (count) {
      return reply
        .code(403)
        .send({ error: 'already_joined' })
    }

    const participation = {
      user_id: uid,
      event_id: eid,
      status: 1,
      participation_time: Date.now()
    }

    await participationModel.create(participation)

    reply.send(participation)
  }

  const leaveEvent = async (request, reply) => {
    const eid = request.params.event_id
    const uid = request.req.cookies.user_id
    const where = {
      user_id: uid,
      event_id: eid
    }

    if (!uid) {
      return reply
        .code(403)
        .send({ error: 'user_not_login' })
    }

    const participation = await participationModel.findOne({ where })

    if (participation === null) {
      return reply
        .code(403)
        .send({ error: 'could not leave event not joined yet' })
    }

    await participationModel.destroy({ where })

    reply.send(participation)
  }

  const likeEvent = async (request, reply) => {
    const eid = request.params.event_id
    const cookies = request.req.cookies
    const uid = cookies && cookies.user_id

    if (!uid) {
      return reply
        .code(403)
        .send({ error: 'user_not_login' })
    }

    const count = await eventLikeModel.count({
      where: {
        user_id: uid,
        event_id: eid
      }
    })

    if (count) {
      return reply
        .code(403)
        .send({ error: 'already_liked' })
    }

    const eventLike = {
      user_id: uid,
      event_id: eid,
      like_time: Date.now()
    }

    await eventLikeModel.create(eventLike)

    reply.send(eventLike)
  }

  const unlikeEvent = async (request, reply) => {
    const eid = request.params.event_id
    const uid = request.req.cookies.user_id
    const where = {
      user_id: uid,
      event_id: eid
    }

    if (!uid) {
      return reply
        .code(403)
        .send({ error: 'user_not_login' })
    }

    const eventLike = await eventLikeModel.findOne({ where })

    if (eventLike === null) {
      return reply
        .code(403)
        .send({ error: 'could not unlike event not liked yet' })
    }

    await eventLike.destroy({ where })

    reply.send(eventLike)
  }

  return {
    getEventsByIds,
    getEventsByQuery,
    joinEvent,
    leaveEvent,
    likeEvent,
    unlikeEvent
  }
}

module.exports = eventController
