'use strict'

const controllers = models => {
  return {
    userController: (require('./user.js'))(models),
    eventController: (require('./event.js'))(models)
  }
}

module.exports = controllers
