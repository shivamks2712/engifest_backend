"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      question_name: {
        type: Sequelize.STRING,
      },
      option_1: {
        type: Sequelize.STRING,
      },
      option_2: {
        type: Sequelize.STRING,
      },
      option_3: {
        type: Sequelize.STRING,
      },
      option_4: {
        type: Sequelize.STRING,
      },
      option_1_count: {
        type: Sequelize.DOUBLE,
      },
      option_2_count: {
        type: Sequelize.DOUBLE,
      },
      option_3_count: {
        type: Sequelize.DOUBLE,
      },
      option_4_count: {
        type: Sequelize.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questions");
  },
};
