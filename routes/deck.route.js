const models = require('../models');
const Boom = require('boom');

module.exports = function (hapiServer) {
    /**
     * Retrieve all decks that are not deleted
     */
    hapiServer.route({
        method: 'GET',
        path: '/deck',
        handler: (request, reply) => {
            models.Deck.findAll({
                where: {
                    isDeleted: false
                }
            }).then(function (decks) {
                reply(decks);
            });
        }
    });

    /**
     * Get a deck by ID
     */
    hapiServer.route({
        method: 'GET',
        path: '/deck/{id}',
        handler: (request, reply) => {
            var id = encodeURIComponent(request.params.id);

            models.Deck.findById(id).then(function (deck) {
                if (!deck) {
                    reply({error: 'no deck found'});
                }
                else {
                    reply(deck);
                }
            });
        }
    });

    /**
     * Add a deck to the database
     */
    hapiServer.route({
        method: 'POST',
        path: '/deck',
        handler: (request, reply) => {
            var payload = request.payload;

            if (!payload || !payload.name) {
                const error = Boom.badRequest('invalid deck object');
                reply(error);
            }
            else {
                models.Deck.create(payload).then((deck) => {
                    reply(deck);
                }).catch(function (error) {
                    reply(Boom.badImplementation(error));
                });
            }
        }
    });

    /**
     * Mark a deck as deleted from the database
     */
    hapiServer.route({
        method: 'DELETE',
        path: '/deck/{id}',
        handler: (request, reply) => {
            var id = encodeURIComponent(request.params.id);

            models.Deck.findById(id).then(deck => {
                deck.isDeleted = true;
                deck.save()
                    .then(() => reply('ok'), error => reply(Boom.badImplementation(error))); 
            }, error => reply(Boom.badImplementation(error))); 
        }
    })
};