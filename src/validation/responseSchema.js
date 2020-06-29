const Joi = require('@hapi/joi');

module.exports = Joi.object({
  type: Joi.string().required(),
  headers: Joi.object({
    'Content-Type': Joi.string(),
    Location: Joi.string(),
  }),
  payload: Joi.any(),
}).required();
