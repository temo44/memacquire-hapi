'use strict';
module.exports = function (sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Deck;
};