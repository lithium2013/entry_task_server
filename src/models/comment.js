const Sequelize = require('sequelize')

const commentModel = sequelize => {
  const Comment = sequelize.define('comment', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    create_time: { type: Sequelize.DATE, allowNull: false },
    comment: { type: Sequelize.TEXT, allowNull: false }
  }, {
    indexes: [
      { fields: ['event_id'] }
    ]
  })

  Comment.sync({ force: true }).then(() => {
    return Comment.create({
      user_id: 1,
      event_id: 1,
      create_time: Date.now(),
      comment: 'test_comment_content'
    })
  })

  return Comment
}

module.exports = commentModel
