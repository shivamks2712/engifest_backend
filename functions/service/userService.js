const Dao = require("../dao");

module.exports = {
  createUser: async (userObj) => {
    try {
      const user = await Dao.userDao.createUser(userObj);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  getUser: async (userObj) => {
    try {
      const user = await Dao.userDao.getUser(userObj);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  updateUser: async (userObj) => {
    try {
      const user = await Dao.userDao.updateUser(userObj);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  getUserCount: async () => {
    try {
      const count = await Dao.userDao.getUserCount();
      return count;
    } catch (error) {
      throw new Error(error);
    }
  },
};
