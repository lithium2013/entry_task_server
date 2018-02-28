const Sequelize = require('sequelize')

const eventModel = sequelize => {
  const Event = sequelize.define('event', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: Sequelize.STRING(128), allowNull: false },
    creator_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    channel_id: { type: Sequelize.INTEGER(10).UNSIGNED, allowNull: false },
    begin_time: { type: Sequelize.DATE, allowNull: false },
    end_time: { type: Sequelize.DATE, allowNull: false },
    create_time: { type: Sequelize.DATE, allowNull: false },
    update_time: { type: Sequelize.DATE, allowNull: false },
    location: { type: Sequelize.STRING(255), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false }
  }, {
    indexes: [
      { fields: ['creator_id'] },
      { fields: ['channel_id'] },
      { fields: ['begin_time'] },
      { fields: ['end_time'] }
    ]
  })

  // force: true will drop the table if it already exists
  Event.sync({ force: true }).then(() => {
    // Table created
    return Event.create({
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
  })

  return Event
}

module.exports = eventModel
