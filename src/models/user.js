const Sequelize = require('sequelize')

const userModel = sequelize => {
  const User = sequelize.define('user', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    username: { type: Sequelize.STRING(32), allowNull: false, unique: true },
    password: { type: Sequelize.STRING(32), allowNull: false },
    email: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    salt: { type: Sequelize.STRING(32), allowNull: false }
  }, {
    indexes: [{ fields: ['username'] }]
  })

  // force: true will drop the table if it already exists
  User.sync({ force: true }).then(() => {
    // Table created
    return User.create({
      username: 'Jinyang.Li',
      password: 'df10ef8509dc176d733d59549e7dbfaf', // 123456
      salt: 'abc',
      email: 'test@gmail.com'
    })
  })

  return User
}

module.exports = userModel
