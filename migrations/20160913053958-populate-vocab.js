'use strict';

const fs = require('fs');
const _ = require('lodash');
const models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    fs.readFile(`${__dirname}/vocabulary.txt`, 'utf8', function (err, data, done) {
      // key;type;character;meaning;image;onyomi;kunyomi;important_reading;kana;level
      const key = 0;
      const type = 1;
      const character = 2;
      const meaning = 3;
      const image = 4;
      const onyomi = 5;
      const kunyomi = 6;
      const importantReading = 7;
      const kana = 8;
      const level = 9;

      var lines = _.split(data, '\n');
      lines = _.drop(lines, 4);

      var radicals = _.map(lines, function (rowString) {
        var val = _.map(_.split(rowString, ';'), function (value) {
          if (!value) return undefined;
          return value;
        });

        return {
          key: val[key],
          character: val[character],
          meaning: val[meaning],
          kana: val[kana],
          level: val[level],
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        };
      });

      queryInterface.sequelize.query(queryInterface.QueryGenerator.bulkInsertQuery('Vocabs', radicals)).then(function () {
        done(null);
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
