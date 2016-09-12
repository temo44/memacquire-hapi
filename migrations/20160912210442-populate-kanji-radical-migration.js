const fs = require('fs');
const _ = require('lodash');
const models = require('../models');

'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    /*
     Add altering commands here.
     Return a promise to correctly handle asynchronicity.

     Example:
     return queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const kanji = 0;
    const url = 1;
    const radical = 2;
    const radicalMeaning = 3;
    
    fs.readFile(`${__dirname}/kanji_radicals.csv`, 'utf8', (err, data) => {
      if(err) {
        return done(err);
      }
      //split lines
      var lines = _.split(data, '\n');
      
      var kanjiRadicals = _.map(lines, (row) => {
        var vals = _.map(_.split(row, ','), (val) => { return _.trim(val, ' "'); });
        
        // when there are only three values on a row, then it means that the radical is an image, which we can't handle
        // at the moment
        if(vals.length < 4) {
          vals[radicalMeaning] = vals[radical];
          vals[radical] = undefined;
        }
        
        return {
          kanji: vals[kanji],
          radical: vals[radical],
          radicalMeaning: vals[radicalMeaning],
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        };
      });
      
      queryInterface.sequelize.query(queryInterface.QueryGenerator.bulkInsertQuery('KanjiRadicals', kanjiRadicals))
        .then(() => done(null));
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
