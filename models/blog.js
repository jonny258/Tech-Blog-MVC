const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./user'); // Import the User model
const Comment = require('./comment')

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'blog',
    tableName: 'blog',
  }
);


Blog.hasMany(Comment, { foreignKey: 'blog_id' });
Comment.belongsTo(Blog, { foreignKey: 'blog_id' });

module.exports = Blog;
