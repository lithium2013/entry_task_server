'use strict'

const channelController = models => {
  const { channelModel } = models
  const { send403 } = _pangolier.utils

  return {
    getChannels: async (request, reply) => {
      const { isAuthed } = request.req.userStatus

      if (isAuthed) {
        const channels = await channelModel.findAll()

        return reply.send({
          channels: channels.map(item => item.dataValues)
        })
      }

      return send403(reply, 'Invalid token')
    }
  }
}

module.exports = channelController
