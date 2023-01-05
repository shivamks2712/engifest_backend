const Joi = require("joi");

module.exports = {
  addParticipant: (participantObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
      participants: Joi.array().items(
        Joi.object({
          college_name: Joi.string().trim().required(),
          name: Joi.string().trim().required(),
          email: Joi.string().lowercase().trim().min(1).required().email(),
          phone_number: Joi.string().trim(),
        })
      ),
    });
    return Joi.validate(participantObj, schema);
  },
};
