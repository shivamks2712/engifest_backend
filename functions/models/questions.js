const Enums = require("../enums");

module.exports = (sequelize, Sequelize) => {
  const question = sequelize.define(
    "questions",
    {
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
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );

  return question;
};
