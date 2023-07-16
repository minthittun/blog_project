const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});


module.exports = Post;
