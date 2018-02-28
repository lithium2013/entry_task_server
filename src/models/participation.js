const Sequelize = require('sequelize')

const participationModel = sequelize => {
  const Participation = sequelize.define('participation', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    user_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' }
  }, {
    indexes: [
      { fields: ['event_id'] },
      { fields: ['user_id'] },
      { fields: ['user_id', 'event_id'] }
    ]
  })

  Participation.sync({ force: true }).then(() => {
    return Participation.create({
      user_id: 1,
      event_id: 1
    })
  })

  return Participation
}

module.exports = participationModel
