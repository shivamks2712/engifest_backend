const Dao = require("../dao");

module.exports = {
  getParticipant: async (participantObj) => {
    try {
      const participant = await Dao.participantDao.getParticipant(
        participantObj
      );
      return participant;
    } catch (error) {
      throw new Error(error);
    }
  },
  addParticipant: async (participantObj) => {
    try {
      const participant = await Dao.participantDao.addParticipant(
        participantObj
      );
      return participant;
    } catch (error) {
      throw new Error(error);
    }
  },
  getParticipantCount: async (participantObj) => {
    try {
      const count = await Dao.participantDao.getParticipantCount(
        participantObj
      );
      return count;
    } catch (error) {
      throw new Error(error);
    }
  },
};
