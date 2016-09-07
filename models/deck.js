'use strict';
module.exports = function (sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Deck;
};