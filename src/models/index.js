let User,
  Event,
  Participation,
  Comment,
  Image,
  Like,
  Channel

const connect = async () => {
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
  _pangolier.sequelize = sequelize
}

const loadModels = async () => {
  const { sequelize } = _pangolier

  User = require('./user.js')(sequelize)
  Event = require('./event.js')(sequelize)
  Participation = require('./participation.js')(sequelize)
  Comment = require('./comment.js')(sequelize)
  Image = require('./image.js')(sequelize)
  Like = require('./like.js')(sequelize)
  Channel = require('./channel.js')(sequelize)

  // setting associations
  Event.belongsToMany(User, { through: Participation })
  User.belongsToMany(Event, { through: Participation })

  Like.hasOne(User, { foreignKey: 'userId' })
  Like.hasOne(Event, { foreignKey: 'eventId' })

  Comment.hasOne(User, { foreignKey: 'userId' })
  Comment.hasOne(Event, { foreignKey: 'eventId' })

  Event.hasMany(Image, { foreignKey: 'eventId' })

  return Promise.all([
    User.sync({ force: true }),
    Event.sync({ force: true }),
    Participation.sync({ force: true }),
    Comment.sync({ force: true }),
    Image.sync({ force: true }),
    Like.sync({ force: true }),
    Channel.sync({ force: true })
  ])
}

const initDBContent = models => {
  User.create({
    username: 'Jinyang.Li',
    password: 'df10ef8509dc176d733d59549e7dbfaf', // 123456
    salt: 'abc',
    email: 'test@gmail.com'
  })

  Event.create({
    name: 'test_event',
    creator_id: 1,
    channel_id: 1,
    begin_time: Date.now(),
    end_time: Date.now(),
    create_time: Date.now(),
    update_time: Date.now(),
    location: 'SZ_China',
    description: 'test_event_desc'
  })

  Image.create({
    eventId: 1,
    image: '/test/image/src'
  })

  Channel.create({
    name: 'test_channel'
  })
}

module.exports = {
  getModels: () => {
    return {
      User,
      Event,
      Participation,
      Comment,
      Image,
      Like,
      Channel
    }
  },
  initModels: async () => {
    await connect()
    await loadModels()
    initDBContent()
  }
}
