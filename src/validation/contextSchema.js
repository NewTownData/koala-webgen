const Joi = require('joi');
const configurationSchema = require('./configurationSchema');

module.exports = Joi.object({
  configuration: configurationSchema.required(),
  paths: Joi.object({
    static: Joi.string().required(),
    posts: Joi.string().required(),
    pages: Joi.string().required(),
    theme: Joi.string().required(),
  }).required(),
}).required();
