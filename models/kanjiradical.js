'use strict';
module.exports = function(sequelize, DataTypes) {
  var KanjiRadical = sequelize.define('KanjiRadical', {
    kanji: DataTypes.STRING,
    radical: DataTypes.STRING,
    radicalImage: DataTypes.STRING,
    radicalMeaning: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return KanjiRadical;
};