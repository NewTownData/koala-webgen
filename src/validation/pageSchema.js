const Joi = require('@hapi/joi');

const tagsSchema = Joi.array().items(
  Joi.object({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }).required(),
);

const pageSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  link: Joi.string().required(),
  body: Joi.string().required(),
});

const postSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  link: Joi.string().required(),
  body: Joi.string().required(),
  tags: tagsSchema.required(),
});

const postItemSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  link: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string().required()).required(),
});

module.exports = Joi.object({
  type: Joi.string().required(),
  page: Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()).required(),
    url: Joi.string().uri().required(),
    websitePath: Joi.string().required(),
    pageTitle: Joi.string().required(),
    currentPath: Joi.string().required(),
  }).required(),
  navigation: Joi.object({
    menu: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          link: Joi.string().required(),
        }).required(),
      )
      .required(),
    archive: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          link: Joi.string().required(),
        }).required(),
      )
      .required(),
    tags: tagsSchema.required(),
  }).required(),
  content: Joi.object({
    posts: Joi.object({
      title: Joi.string().required(),
      items: Joi.array().items(postItemSchema.required()).required(),
      pagination: Joi.object({
        pageNumber: Joi.number().required(),
        previousLink: Joi.string().optional(),
        nextLink: Joi.string().optional(),
      }).required(),
    }),
    post: postSchema,
    page: pageSchema,
  })
    .xor('posts', 'post', 'page')
    .required(),
}).required();
