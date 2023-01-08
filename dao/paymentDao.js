const Common = require("../common");
const db = require("../models");

module.exports = {
  createPaymentOrder: async (order) => {
    try {
      const newOrder = await db.payment.create({
        id: Common.helper.generateId(),
        ...order,
      });
      if (!newOrder) throw new Error("Can't Create Object");
      return newOrder.dataValues;
    } catch (error) {
      throw new Error(error);
    }
  },
  getOrder: async (order) => {
    try {
      const query = {
        where: order
      };
      const newOrder = await db.payment.findOne(query);
      return newOrder;
    } catch (error) {
      throw new Error(error);
    }
  },
};
