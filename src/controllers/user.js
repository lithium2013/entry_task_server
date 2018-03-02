'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Like, Participation, Event } = _pangolier.getModels()
const { send403, send400 } = _pangolier.utils

module.exports = {
  getUserInfo: async (request, reply) => {
    const { isAuthed, uid } = request.req.userStatus

    if (!isAuthed) {
      return send403(reply, 'invalid_token')
    }

    const user = await User.findOne({ where: { id: uid } })
    const likesCount = await Like.count({ where: { userId: uid } })
    const pastCount = await user.countEvents({
      where: {
        begin_time: {
          [Op.lte]: Date.now()
        }
      }
    })

    const goingCount = await user.countEvents({
      where: {
        begin_time: {
          [Op.gte]: Date.now()
        }
      }
    })

    const { id, username, email } = user.dataValues

    reply.send({
      id,
      username,
      email,
      likesCount,
      pastCount,
      goingCount
    })
  },

  getUserEvents: async (request, reply) => {
    let {
      offset,
      limit,
      events,
      type
    } = request.query
    const { isAuthed, uid } = request.req.userStatus

    if (!isAuthed) {
      return send403(reply, 'invalid_token')
    }

    if (!type) {
      return send400(reply, 'missing paramater `type`')
    }

    const user = await User.findOne({ where: { id: uid } })

    switch (type) {
      case 'liked':
        let like = await Like.findAll({ where: { userId: uid } })
        events = await Event.findAll({
          where: {
            id: like.map(item => item.dataValues.eventId)
          },
          offset,
          limit
        })
        break
      case 'going':
        events = await user.getEvents({
          where: {
            begin_time: {
              [Op.gte]: Date.now()
            }
          },
          offset,
          limit
        })
        break
      case 'past':
        events = await user.getEvents({
          where: {
            begin_time: {
              [Op.lte]: Date.now()
            }
          },
          offset,
          limit
        })
        break
      default:
        return send400(reply, 'invalid `type` value')
    }

    reply.send({
      events: events.map(item => item.dataValues)
    })
  }
}
