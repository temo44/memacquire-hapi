const models = require('../models');

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
};