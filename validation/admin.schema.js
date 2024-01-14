const Joi = require('joi');
const constants = require('../config/constants');

module.exports.users_login_post_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports.users_change_password_post_schema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.users_register_post_schema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  contact: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  zip: Joi.number().required(),
  country: Joi.string().required(),
});

module.exports.users_get_schema = Joi.object({
  count: Joi.number(),
  page: Joi.number(),
  sort: Joi.string(),
  order: Joi.string(),
  q: Joi.string(),
  type: Joi.string().valid(constants.userTypes.admin, constants.userTypes.user),
});

module.exports.profile_put_schema = Joi.object({
  name: Joi.string().required(),
});
