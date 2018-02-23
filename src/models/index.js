const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify) {
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
    user: (require('./user.js'))(sequelize),
    event: (require('./event.js'))(sequelize),
    participation: (require('./participation.js'))(sequelize),
    eventLike: (require('./eventLike.js'))(sequelize),
    category: (require('./category.js'))(sequelize)
  }

  // fastify.decorate('sequelize', sequelize)
  // fastify.decorate('Sequelize', Sequelize)
  fastify.decorate('models', models)
}

module.exports = fastifyPlugin(dbConnector)
