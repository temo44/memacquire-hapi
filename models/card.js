'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        Card.belongsTo(models.Deck)
      }
    }
  });
  return Card;
};