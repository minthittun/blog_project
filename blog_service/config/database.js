const { Sequelize } = require('sequelize');
const path = require('path');

const configPath = path.resolve(__dirname, 'config.json');
const config = require(configPath);

const sequelize = new Sequelize(process.env.NODE_ENV === 'production' ? config.production : config.development)


module.exports = sequelize;
