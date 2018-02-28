const Sequelize = require('sequelize')

const channelModel = sequelize => {
  const Channel = sequelize.define('channel', {
    id: { type: Sequelize.INTEGER(10).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: Sequelize.STRING(32), allowNull: false }
  })

  Channel.sync({ force: true }).then(() => {
    return Channel.create({
      name: 'test_channel'
    })
  })

  return Channel
}

module.exports = channelModel
