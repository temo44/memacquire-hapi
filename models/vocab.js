'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vocab = sequelize.define('Vocab', {
    key: DataTypes.STRING,
    character: DataTypes.STRING,
    meaning: DataTypes.STRING,
    kana: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Vocab;
};