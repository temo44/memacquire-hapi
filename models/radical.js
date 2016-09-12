'use strict';
module.exports = function(sequelize, DataTypes) {
  var Radical = sequelize.define('Radical', {
    key: DataTypes.STRING,
    character: DataTypes.STRING,
    meaning: DataTypes.STRING,
    image: DataTypes.STRING,
    level: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Radical;
};