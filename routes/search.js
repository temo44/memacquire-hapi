const models = require('../models');
const Boom = require('boom');

module.exports = function (hapiServer) {
  /**
   * Add a deck to the database
   */
  hapiServer.route({
    method: 'GET',
    path: '/search/{keyword}',
    handler: (request, reply) => {
      var keyword = request.params.keyword;

      if (!keyword) {
        const error = Boom.badRequest('No keyword sent');
        return reply(error);
      }
    
      var result = {};
      
      //get kanji radicals first
      models.KanjiRadical.findAll({
        where: {
          kanji: keyword
        }
      }).then(kanjiRadicals => reply({ radicals: kanjiRadicals })); 
    }
  });
};