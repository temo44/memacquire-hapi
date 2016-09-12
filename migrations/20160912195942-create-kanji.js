'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Kanjis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      character: {
        type: Sequelize.STRING
      },
      meaning: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      onyomi: {
        type: Sequelize.STRING
      },
      kunyomi: {
        type: Sequelize.STRING
      },
      importantReading: {
        type: Sequelize.STRING
      },
      kana: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Kanjis');
  }
};