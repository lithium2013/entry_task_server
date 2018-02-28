'use strict'

const store = {}

module.exports = {
  makeToken: uid => {
    const token = Date.now()

    store[token] = uid

    return token
  },
  getUid: token => token && store[token],
  deleteToken: token => {
    return token && delete store[token]
  }
}
