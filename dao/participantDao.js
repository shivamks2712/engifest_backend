const Common = require("../common");
const db = require("../models");

module.exports = {
  getParticipant: async (participantObj) => {
    try {
      const participant = await db.participant.findOne({
        where: participantObj,
      });
      return participant;
    } catch (error) {
      throw new Error(error);
    }
  },
  getParticipantCount: async (participantObj) => {
    try {
      const participant = await db.participant.findAll({
        where: participantObj,
      });
      return participant.length;
    } catch (error) {
      throw new Error(error);
    }
  },
  addParticipant: async (participantObj) => {
    try {
      const participant = await db.participant.create({
        id: Common.helper.generateId(),
        ...participantObj,
      });
      if (!participant) throw new Error("Can't Create Object");
      return participant.dataValues;
    } catch (error) {
      throw new Error(error);
    }
  },
};
