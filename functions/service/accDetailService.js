const Dao = require("../dao");

module.exports = {
  add: async (accObj) => {
    try {
      const acc = await Dao.accDetailDao.add(accObj);
      return acc;
    } catch (error) {
      throw new Error(error);
    }
  },
};
