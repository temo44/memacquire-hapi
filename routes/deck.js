const models = require('../models');

module.exports = {
  method: 'GET',
  path: '/deck/{id}',
  handler: function (request, reply) {
    var id = encodeURIComponent(request.params.id);

    models.Deck.findById(id).then(function (deck) {
      reply(deck);
    });
  }
};