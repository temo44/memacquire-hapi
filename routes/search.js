const models = require('../models');
const Boom = require('boom');
const Promise = require('bluebird');
const _ = require('lodash');
const xray = require('x-ray')();

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

  /**
   * Scrape the jisho page for answers
   */
  hapiServer.route({
    method: 'GET',
    path: '/search/jisho/{keyword}',
    handler: (request, reply) => {
      var keyword = encodeURIComponent(request.params.keyword);

      if (!keyword) {
        const error = Boom.badRequest('No keyword sent');
        return reply(error);
      }
      var result = {};

      var jishoKanjiRadicalSearch = new Promise((resolve, reject) => {
        xray(`http://jisho.org/search/${keyword}%20%23kanji`, {
          kanji: xray('div.kanji.details', [{
            character: '.character',
            meaning: '.kanji-details__main-meanings',
            kunyomi: ['.kanji-details__main-readings .kun_yomi dd a'],
            onyomi: ['.kanji-details__main-readings .on_yomi dd a']
          }]),
          radicals: xray('div.kanji.details', [{
            kanji: '.character',
            character: ['.radicals dd a']
          }])
        })
          ((err, payload) => {
            if (err) {
              reject(err);
              return reply(Boom.badImplementation(err));
            }

            //clean up a bit
            payload.kanji = _.map(payload.kanji, (row) => {
              row.meaning = _.trim(row.meaning, ' \n');
              row.onyomi = _.join(row.onyomi, ', ');
              row.kunyomi = _.join(row.kunyomi, ', ');
              return row;
            });

            result.kanji = payload.kanji;
            result.radicals = payload.radicals;
            resolve();
          });
      });

      var jishoVocabSearch = new Promise((resolve, reject) => {
        xray(`http://jisho.org/search/${keyword}`, '#primary .concept_light.clearfix', [{
          character: '.concept_light-readings span.text',
          kana: ['.concept_light-readings span.furigana span, .furigana rt'],
          meaning: '.meanings-wrapper .meaning-meaning'
        }])((err, payload) => {
          if (err) {
            reject(err);
            return reply(Boom.badImplementation(err));
          }

          //clean up a bit
          payload = _.map(payload, (data) => {
            data.meaning = _.trim(data.meaning, ' \n');
            data.character = _.trim(data.character, ' \n');
            data.kana = _.join(_.map(data.kana, (char, index) => {
              if (char === '') {
                return data.character[index];
              } else {
                return char;
              }
            }), '');
            return data;
          });

          result.vocab = payload;
          resolve();
        });

      });

      var tagorinVocabSearch = new Promise((resolve, reject) => {
        xray(`http://tangorin.com/general/${keyword}`, '.dictResults dl.dictEntries', [{
          character: '.concept_light-readings span.text',
          kana: ['dt span ruby '],
          meaning: '.meanings-wrapper .meaning-meaning'
        }])((err, payload) => {
          if (err) {
            reject(err);
            return reply(Boom.badImplementation(err));
          }

          //clean up a bit
          payload = _.map(payload, (data) => {
            data.meaning = _.trim(data.meaning, ' \n');
            data.character = _.trim(data.character, ' \n');
            data.kana = _.join(_.map(data.kana, (char, index) => {
              if (char === '') {
                return data.character[index];
              } else {
                return char;
              }
            }), '');
            return data;
          });

          result.vocab = payload;
          resolve();
        });

      });

      Promise.all([jishoKanjiRadicalSearch, jishoVocabSearch]).then(() => reply(result));
    }
  });

  hapiServer.route({
    method: 'GET',
    path: '/search/tangorin/{keyword}',
    handler: (request, reply) => {
      var keyword = encodeURIComponent(request.params.keyword);

      if (!keyword) {
        const error = Boom.badRequest('No keyword sent');
        return reply(error);
      }
      var result = {};
      var error;

      var tagorinVocabSearch = new Promise((resolve, reject) => {
        xray(`http://tangorin.com/general/${keyword}`, '#dictResults dl#dictEntries .entry', [{
          character: '.writing',
          kana: 'dt span.kana ruby rb',
          meaning: 'dd ul li ol li .eng'
        }])((err, payload) => {
          if (err) {
            error = Boom.badImplementation(err);
            return reject(err);
          }

          //clean up a bit
          payload = _.map(payload, (data) => {
            data.meaning = _.trim(data.meaning, ' \n');
            data.character = _.trim(data.character, ' \n');
            data.kana = _.trim(data.kana, ' \n');
            return data;
          });

          result.vocab = payload;
          resolve();
        }); 
      });
      Promise.all([tagorinVocabSearch]).then(() => reply(error || result));
    }
  });
}
