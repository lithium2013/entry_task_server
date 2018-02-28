'use strict'

const controllers = models => {
  return {
    userController: (require('./user.js'))(models),
    channelController: (require('./channel.js'))(models),
    eventController: (require('./event.js'))(models)
  }
}

module.exports = controllers
