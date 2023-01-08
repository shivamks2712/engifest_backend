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
      access_token: {
        type: Sequelize.STRING,
      },
      ticket_number: {
        type: Sequelize.STRING,
      },
      isDtu: {
        type: Sequelize.BOOLEAN,
      },
      isEntered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
      },
      college_name: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      allowed_entries: {
        type: Sequelize.DOUBLE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  user.associate = (models) => {
    models.user.hasMany(models.participant);
    models.user.hasMany(models.payment);
  };

  return user;
};
