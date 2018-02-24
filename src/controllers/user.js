'use strict'

const md5 = require('md5')

const encrypte = (password, salt) => md5(`${password}${salt}`).slice(0, 32)
const genSalt = () =>
  Math.ceil(Math.random() * Math.pow(10, 16)).toString() +
  Math.ceil(Math.random() * Math.pow(10, 16)).toString()

const userController = models => {
  const { userModel } = models

  const register = async (request, reply) => {
    const { username, name, password, email } = request.body
    const exist = await userModel.findOne({
      where: { username }
    })

    if (exist !== null) {
      return reply
        .code(403)
        .send({ error: 'error_username_exist' })
    }

    const salt = genSalt()

    const user = await userModel.create({
      username,
      name,
      salt,
      password: encrypte(password, salt),
      email,
      ctime: Date.now()
    })

    reply
      .header('Set-Cookie', [`user_id=${user.dataValues.id}`])
      .send({
        user_id: user.dataValues.id
      })
  }

  const login = async (request, reply) => {
    const { username, password } = request.body
    const user = await userModel.findOne({
      where: { username }
    })

    if (user === null) {
      return reply
        .code(403)
        .send({ error: 'error_username' })
    }

    if (
      user.dataValues.password ===
      encrypte(password, user.dataValues.salt)
    ) {
      return reply
        .header('Set-Cookie', [`user_id=${user.dataValues.id}`])
        .send({
          user_id: user.dataValues.id
        })
    }

    reply
      .code(403)
      .send({ error: 'error_password' })
  }

  const getUsers = async (request, reply) => {
    const uids = request.body.user_ids
    const users = await userModel.findAll({
      where: { id: uids }
    })

    reply.send({
      users: users.map(item => {
        const { id, username, name, email, ctime } = item.dataValues
        return { id, username, name, email, ctime }
      })
    })
  }

  return {
    register,
    login,
    getUsers
  }
}

module.exports = userController
