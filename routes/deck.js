const models = require('../models');
const Boom = require('boom');

module.exports = function (hapiServer) {
  hapiServer.route({
    method: 'GET',
    path: '/deck',
    handler: (request, reply) => {
      models.Deck.findAll().then(function (decks) {
        reply(decks);
      });
    }
  });

  hapiServer.route({
    method: 'GET',
    path: '/deck/{id}',
    handler: (request, reply) => {
      var id = encodeURIComponent(request.params.id);

      models.Deck.findById(id).then(function (deck) {
        if (!deck) {
          reply({ error: 'no deck found' });
        }
        else {
          reply(deck);
        }
      });
    }
  });


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
        }).catch(function(error) {
          reply(Boom.badImplementation(error));
        });
      }
    }
  })
};