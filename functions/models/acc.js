module.exports = (sequelize, Sequelize) => {
  const acc = sequelize.define(
    "accs",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      checkin: {
        type: Sequelize.STRING,
      },
      checkout: {
        type: Sequelize.STRING,
      },
      maleCount: {
        type: Sequelize.DOUBLE,
      },
      femaleCount: {
        type: Sequelize.DOUBLE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  acc.associate = (models) => {
    // associations can be defined here
    models.acc.hasMany(models.accDetail);
  };
  return acc;
};
