const Sequelize = require('sequelize')

const eventLikeModel = function (sequelize) {
  const EventLike = sequelize.define('event_like', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    like_time: { type: Sequelize.DATE, allowNull: false }
  }, {
    indexes: [
      { fields: ['event_id'] },
      {
        unique: true,
        fields: ['user_id', 'event_id']
      }
    ]
  })

  EventLike.sync({ force: true }).then(() => {
    return EventLike.create({
      user_id: 1,
      event_id: 1,
      like_time: Date.now()
    })
  })

  return EventLike
}

module.exports = eventLikeModel
