const Joi = require("joi");

module.exports = {
  createUser: (userObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
      name: Joi.string().trim().min(1).required(),
      uid: Joi.string().min(1).required(),
      photo: Joi.string().trim(),
      // college_name: Joi.string().trim().min(1).required(),
      // access_token: Joi.string().trim().min(1).required(),
      // phone_number: Joi.string().trim(),
    });
    return Joi.validate(userObj, schema);
  },
  getUser: (userObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
    });
    return Joi.validate(userObj, schema);
  },
  doVoting: (userObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
      vote: Joi.array().items(
        Joi.object({
          questionId: Joi.string().uuid().required(),
          option: Joi.string().required(),
        })
      ),
    });
  },
};
