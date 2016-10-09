'use strict';

const Hapi = require('hapi');
const Sequelize = require('sequelize');
const models = require('./models');
const initRoutes = require('./routes');

const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/config/config.json')[env];

const server = new Hapi.Server();
server.connection({
  host: config.apiUrl,
  port: config.apiPort,
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

initRoutes(server);

models.sequelize.sync().then(function () {

  server.start((err) => {

    if (err) {
      throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
  });
});