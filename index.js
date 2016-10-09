'use strict';

const Hapi = require('hapi');
const Sequelize = require('sequelize');
const models = require('./models');
const initRoutes = require('./routes');

const config = require('./config');
var host = process.env.HOST || '0.0.0.0'

const server = new Hapi.Server();
server.connection({
  host: host,
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