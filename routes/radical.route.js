const models = require('../models');
const Boom = require('boom');

module.exports = function (hapiServer) {
    /**
     * Retrieve all decks that are not deleted
     */
    hapiServer.route({
        method: 'GET',
        path: '/radical',
        handler: (request, reply) => {
            models.Radical.findAll().then(reply);
        }
    });
}