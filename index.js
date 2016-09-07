'use strict';

const Hapi = require('hapi');
const Sequelize = require('sequelize');
const models = require('./models');
const initRoutes = require('./routes');


const server = new Hapi.Server();
server.connection({
  host: '127.0.0.1',
  port: 5000,
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