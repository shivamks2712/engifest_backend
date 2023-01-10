const Common = require("../common");
const db = require("../models");

module.exports = {
  getAllQuestions: async () => {
    try {
      const questions = await db.question.findAll();
      return questions;
    } catch (error) {
      throw new Error(error);
    }
  },
  incrementCount: async (questionObj) => {
    try {
      const count = await db.transfer.increment(questionObj.field, {
        by: 1,
        where: { id: questionObj.id },
      });

      return count;
    } catch (error) {
      throw error;
    }
  },
};
