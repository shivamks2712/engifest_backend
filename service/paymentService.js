const Dao = require("../dao");

module.exports = {
    createPaymentOrder: async (order) => {
    try {
      const newOrder = await Dao.paymentDao.createPaymentOrder(order);
      return newOrder;
    } catch (error) {
      throw new Error(error);
    }
  },
  getOrder: async (order) => {
    try {
      const newOrder = await Dao.paymentDao.getOrder(order);
      return newOrder;
    } catch (error) {
      throw new Error(error);
    }
  }
};
