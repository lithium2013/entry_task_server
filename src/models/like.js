const Sequelize = require('sequelize')

const likeModel = sequelize => {
  const Like = sequelize.define('like', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' },
    like_time: { type: Sequelize.DATE, allowNull: false }
  }, {
    indexes: [
      { fields: ['event_id'] },
      { fields: ['user_id'] },
      { fields: ['user_id', 'event_id'] }
    ]
  })

  Like.sync({ force: true }).then(() => {
    return Like.create({
      user_id: 1,
      event_id: 1,
      like_time: Date.now()
    })
  })

  return Like
}

module.exports = likeModel
