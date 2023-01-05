const Joi = require("joi");

module.exports = {
  createUser: (userObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
      name: Joi.string().trim().min(1).required(),
      college_name: Joi.string().trim().min(1).required(),
      access_token: Joi.string().trim().min(1).required(),
      phone_number: Joi.string().trim(),
      image_url: Joi.string().trim(),
    });
    return Joi.validate(userObj, schema);
  },
  getUser: (userObj) => {
    const schema = Joi.object().keys({
      email: Joi.string().lowercase().trim().min(1).required().email(),
    });
    return Joi.validate(userObj, schema);
  },
};