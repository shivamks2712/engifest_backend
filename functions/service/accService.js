const Dao = require("../dao");

module.exports = {
  add: async (accObj) => {
    try {
      const acc = await Dao.accDao.add(accObj);
      return acc;
    } catch (error) {
      throw new Error(error);
    }
  },
};
