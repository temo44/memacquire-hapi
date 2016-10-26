const handlers = require('./handler');

module.exports = (hapiServer) => {
    hapiServer.route({
        method: 'GET',
        path: '/collect',
        handler: handlers.getHandler
    });
}