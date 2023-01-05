const Common = require("../common");
const db = require("../models");

module.exports = {
  createUser: async (userObj) => {
    try {
      const user = await db.user.create({
        id: Common.helper.generateId(),
        ...userObj,
      });
      if (!user) throw new Error("Can't Create Object");
      return user.dataValues;
    } catch (error) {
      throw new Error(error);
    }
  },
  getUser: async (userObj) => {
    try {
      const query = {
        where: userObj,
        include: [
          {
            model: db.participant,
          },
        ],
      };
      const user = await db.user.findOne(query);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  getUserCount: async () => {
    try {
      const user = await db.user.findAll();
      return user.length;
    } catch (error) {
      throw new Error(error);
    }
  },
};