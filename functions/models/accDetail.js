module.exports = (sequelize, Sequelize) => {
  const accDetail = sequelize.define(
    "accDetails",
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
      age: {
        type: Sequelize.DOUBLE,
      },
      aadhar_number: {
        type: Sequelize.STRING,
      },
      college: {
        type: Sequelize.STRING,
      },
      roll_number: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  accDetail.associate = (models) => {
    // associations can be defined here
    models.accDetail.belongsTo(models.acc);
  };
  return accDetail;
};
