const Common = require("../common");
const db = require("../models");

module.exports = {
  add: async (accObj) => {
    try {
      const acc = await db.acc.create({
        id: Common.helper.generateId(),
        ...accObj,
      });
      if (!acc) throw new Error("Can't Create Object");
      return acc.dataValues;
    } catch (error) {
      throw new Error(error);
    }
  },
  getAll: async () => {
    try {
      const query = {
        include: [
          {
            model: db.accDetail,
          },
        ],
      };
      const getAll = await db.acc.findAll(query);
      return getAll;
    } catch (error) {
      throw new Error(error);
    }
  },
};
