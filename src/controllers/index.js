const controllers = models => {
  return {
    userController: (require('./user.js'))(models)
  }
}

module.exports = controllers
