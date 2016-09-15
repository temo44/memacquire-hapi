const models = require('../models');
const Boom = require('boom');
const Promise = require('bluebird');
const _ = require('lodash');

//private function
/**
 * perform a radical search on a word that is split up into character
 * So it basically does a LIKE ANY. Not supported in SQLite 3 :(
 * @param keyword string
 * @param result [any]
 * @returns {Promise.<TResult>}
 * @private
 */
var _doRadicalSearch = function (keyword, result) {
  //split the word up in smaller pieces
  var wordFilter = _.split(keyword, '');

  return models.KanjiRadical.findAll({
    where: {
      kanji: {
        $like: { $any: wordFilter }
      }
    },
    order: [
      ['kanji', 'ASC']
    ]
  }).then(kanjiRadicals => {
    result.radicals = kanjiRadicals;
  });
};

/**
 * Do a search on each character in the word on the kanji database
 * @param keyword string
 * @param result [any]
 * @returns {Promise.<null>}
 * @private
 */
var _doKanjiSearch = function (keyword, result) {
  var wordFilter = _.split(keyword, '');

  return models.Kanji.findAll({
    where: {
      character: {
        $in: wordFilter
      }
    }
  })
    .then(kanji => result.kanji = kanji);
};

/**
 * Do a search on a word in the vocab on the vocab database
 * @param keyword string
 * @param result [any]
 * @private
 */
var _doVocabSearch = function (keyword, result) {
  return models.Vocab.findAll({
    where: {
      character: {
        $like: `%${keyword}%`
      }
    },
    order: [
      ['level', 'ASC']
    ]
  })
    .then(vocab => result.vocab = vocab);
}

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

      var actions = [];
      //get kanji radicals first
      actions.push(_doRadicalSearch(keyword, result));
      actions.push(_doKanjiSearch(keyword, result));
      actions.push(_doVocabSearch(keyword, result));

      Promise.all(actions).then(() => reply(result));
    }
  });
}
;