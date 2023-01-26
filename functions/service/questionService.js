const Dao = require("../dao");

module.exports = {
  getAllQuestions: async () => {
    try {
      const questions = await Dao.questionDao.getAllQuestions();
      return questions;
    } catch (error) {
      throw new Error(error);
    }
  },
  incrementCount: async (questionObj) => {
    try {
      const count = await Dao.questionDao.incrementCount(questionObj);
      return count;
    } catch (error) {
      throw new Error(error);
    }
  },
};
