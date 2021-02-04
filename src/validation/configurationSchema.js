const Joi = require('@hapi/joi');

module.exports = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  description: Joi.string().required(),
  keywords: Joi.array().items(Joi.string().required()).required(),
  dateFormat: Joi.string().required(),
  pageSize: Joi.number().integer().required(),
  feedSize: Joi.number().integer().required(),
  url: Joi.string().uri().required(),
  websitePath: Joi.string().required(),
  menu: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        link: Joi.string().required(),
      }).required()
    )
    .required(),
  theme: Joi.string().required(),
}).required();
