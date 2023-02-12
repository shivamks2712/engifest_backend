const Enums = require("../enums");

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      uid: {
        type: Sequelize.STRING,
      },
      isVoted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      ticket_number: {
        type: Sequelize.STRING,
      },
      isEntered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      college_name: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      roll_number: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      }
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  return user;
};
