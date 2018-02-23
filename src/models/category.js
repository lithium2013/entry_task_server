const Sequelize = require('sequelize')

const categoryModel = function (sequelize) {
  const Category = sequelize.define('category', {
    id: { type: Sequelize.INTEGER(10).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: Sequelize.STRING(32), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    parent_id: { type: Sequelize.INTEGER(10), allowNull: false }
  }, {
    indexes: [
      { name: 'idx_parent_id', fields: ['parent_id'] }
    ]
  })

  Category.sync({ force: true }).then(() => {
    return Category.create({
      name: 'test_category',
      description: 'test_desc_category',
      parent_id: 1
    })
  })

  return Category
}

module.exports = categoryModel
