const Enums = require("../enums");

module.exports = (sequelize, Sequelize) => {
  const participant = sequelize.define(
    "participants",
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
      college_name: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  participant.associate = (models) => {
    models.participant.belongsTo(models.user);
  };
  return participant;
};
