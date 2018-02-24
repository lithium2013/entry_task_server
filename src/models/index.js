const fastifyPlugin = require('fastify-plugin')

const dbConnector = async fastify => {
  const Sequelize = require('sequelize')
  const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    storage: './db/database.sqlite'
  })

  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  const models = {
    userModel: (require('./user.js'))(sequelize),
    eventModel: (require('./event.js'))(sequelize),
    participationModel: (require('./participation.js'))(sequelize),
    eventLikeModel: (require('./eventLike.js'))(sequelize),
    categoryModel: (require('./category.js'))(sequelize)
  }

  // fastify.decorate('sequelize', sequelize)
  // fastify.decorate('Sequelize', Sequelize)
  fastify.decorate('models', models)
}

module.exports = fastifyPlugin(dbConnector)
