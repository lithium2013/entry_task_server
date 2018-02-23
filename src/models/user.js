const Sequelize = require('sequelize')

const userModel = function (sequelize) {
  const User = sequelize.define('user', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    username: { type: Sequelize.STRING(32), allowNull: false },
    password: { type: Sequelize.STRING(32), allowNull: false },
    salt: { type: Sequelize.STRING(32), allowNull: false },
    name: { type: Sequelize.STRING(64), allowNull: false },
    email: { type: Sequelize.STRING(64), allowNull: false },
    ctime: { type: Sequelize.DATE, allowNull: false }
  }, {
    indexes: [{ name: 'idx_username', unique: true, fields: ['username'] }]
  })

  // force: true will drop the table if it already exists
  User.sync({ force: true }).then(() => {
    // Table created
    return User.create({
      username: 'Jinyang.Li',
      name: 'jinyangli',
      password: '123456',
      salt: 'asdfgg',
      email: 'test@gmail.com',
      ctime: Date.now()
    })
  })

  return User
}

module.exports = userModel
