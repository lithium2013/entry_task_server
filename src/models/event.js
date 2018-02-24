const Sequelize = require('sequelize')

const eventModel = sequelize => {
  const Event = sequelize.define('event', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    title: { type: Sequelize.STRING(128), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    image: { type: Sequelize.STRING(64), allowNull: false },
    creator_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    category_id: { type: Sequelize.INTEGER(10).UNSIGNED, allowNull: false },
    event_start_time: { type: Sequelize.DATE, allowNull: false },
    event_end_time: { type: Sequelize.DATE, allowNull: false },
    ctime: { type: Sequelize.DATE, allowNull: false },
    mtime: { type: Sequelize.DATE, allowNull: false }
  }, {
    indexes: [
      { name: 'idx_creator_id', unique: true, fields: ['creator_id'] },
      { uname: 'idx_category_id', nique: true, fields: ['category_id'] },
      { uname: 'idx_event_start_time', nique: true, fields: ['event_start_time'] }
    ]
  })

  // force: true will drop the table if it already exists
  Event.sync({ force: true }).then(() => {
    // Table created
    return Event.create({
      title: 'test_event',
      description: 'test_desc',
      image: 'test_image',
      creator_id: 1,
      category_id: 1,
      event_start_time: Date.now(),
      event_end_time: Date.now(),
      ctime: Date.now(),
      mtime: Date.now()
    })
  })

  return Event
}

module.exports = eventModel
