const Common = require("../common");
const db = require("../models");
const { QueryTypes, Op } = require("sequelize");

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
      };
      const user = await db.user.findOne(query);
      return user && user.dataValues ? user.dataValues : null;
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
  getAllUsers: async () => {
    try {
      const sql = 'select email, name from users where token is null;'

      const data = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      // const user = await db.user.findAll();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  updateUser: async (userObj) => {
    try {
      const user = await db.user.update(userObj, {
        where: { id: userObj.id },
        returning: true,
        plain: true,
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};
