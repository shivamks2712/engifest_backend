const Enums = require("../enums");

module.exports = (sequelize, Sequelize) => {
  const payment = sequelize.define(
    "payments",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      razorpay_payment_id: {
        type: Sequelize.STRING,
      },
      razorpay_order_id: {
        type: Sequelize.STRING,
      },
      payment_status: {
        type: Sequelize.BOOLEAN,
      },
      email: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );

  payment.associate = (models) => {
    models.payment.belongsTo(models.user);
  };

  return payment;
};
