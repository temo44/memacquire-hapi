'use strict';
module.exports = function(sequelize, DataTypes) {
  var Kanji = sequelize.define('Kanji', {
    key: DataTypes.STRING,
    type: DataTypes.STRING,
    character: DataTypes.STRING,
    meaning: DataTypes.STRING,
    image: DataTypes.STRING,
    onyomi: DataTypes.STRING,
    kunyomi: DataTypes.STRING,
    importantReading: DataTypes.STRING,
    kana: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Kanji;
};