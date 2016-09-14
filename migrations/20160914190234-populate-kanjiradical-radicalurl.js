var models = require('../models');
var _ = require('lodash');
var Promise = require('bluebird');
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    /*
     Add altering commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return models.KanjiRadical.findAll({
      where: {
        radical: null
      }
    })
      .then(function (kanjiRadicals) {
        var filter = _.map(kanjiRadicals, (kanjiRadical) => {
          return _.kebabCase(_.lowerCase(kanjiRadical.radicalMeaning));
        });

        //get all the kanjiRadicals that don't have a radical
        var radicals = models.Radical.findAll({
          where: {
            meaning: {
              $in: filter
            }
          }
        })
          .then(function (radicals) {
            var kanjiRadicalSavePromises = []

            _.each(kanjiRadicals, (kanjiRadical) => {
              var radical = _.find(radicals, (radical) => {
                return _.kebabCase(_.lowerCase(radical.meaning)) === _.kebabCase(_.lowerCase(kanjiRadical.radicalMeaning));
              });

              if (radical) {
                kanjiRadical.radical = radical.character;
                kanjiRadical.radicalImage = radical.image;
                kanjiRadicalSavePromises.push(kanjiRadical.save());
              }
            });

            console.log(kanjiRadicalSavePromises);
            Promise.all(kanjiRadicalSavePromises)
              .then(() => done());
          });

      });
  },

  down: function (queryInterface, Sequelize) {
    /*
     Add reverting commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.dropTable('users');
     */
  }
};
