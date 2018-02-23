const Sequelize = require('sequelize')

const participationModel = function (sequelize) {
  const Participation = sequelize.define('participation', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    status: { type: Sequelize.TINYINT(3).UNSIGNED, allowNull: false },
    participation_time: { type: Sequelize.DATE, allowNull: false }
  }, {
    indexes: [
      { fields: ['event_id'] },
      {
        unique: true,
        fields: ['user_id', 'event_id']
      }
    ]
  })

  Participation.sync({ force: true }).then(() => {
    return Participation.create({
      user_id: 1,
      event_id: 1,
      status: 0,
      participation_time: Date.now()
    })
  })

  return Participation
}

module.exports = participationModel
