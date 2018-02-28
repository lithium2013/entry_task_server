const Sequelize = require('sequelize')

const imageModel = sequelize => {
  const Image = sequelize.define('image', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    event_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    image: { type: Sequelize.STRING(32), allowNull: false }
  }, {
    indexes: [
      { fields: ['event_id'] }
    ]
  })

  Image.sync({ force: true }).then(() => {
    return Image.create({
      event_id: 1,
      image: '/test/image/src'
    })
  })

  return Image
}

module.exports = imageModel
