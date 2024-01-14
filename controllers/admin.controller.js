const passport = require('passport');

const generateToken = require('../helpers/generatetoken');
const UserService = require('../services/user.service');
const responseMessages = require('../config/response.messages');
const constants = require('../config/constants');
const {
  users_login_post_schema,
  users_register_post_schema,
  profile_put_schema,
  users_change_password_post_schema,
  users_get_schema,
} = require('../validation/admin.schema');

// User Routes
module.exports.users_register_post = async (req, res, next) => {
  try {
    const results = await users_register_post_schema.validateAsync(req.body);

    let foundUser = await UserService.findByEmail(results.email);
    if (foundUser) return res.fail(responseMessages.emailAlreadyUsed);
    foundUser = await UserService.findByUserName(results.userName);
    if (foundUser) return res.fail(responseMessages.userNameAlreadyUsed);

    const newUser = await UserService.addUser({
      userName: results.userName,
      email: results.email,
      password: results.password,
      name: results.name,
      type: constants.userTypes.user,
      active: true,
      details: {
        contact: results.contact,
        address: results.address,
        city: results.city,
        zip: results.zip,
        country: results.country,
      },
    });

    return res.success(generateToken(newUser));
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports.users_login_post = async (req, res, next) => {
  try {
    await users_login_post_schema.validateAsync(req.body);

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res.fail(responseMessages.unauthorized);
      }
      if (!user) {
        return res.fail(responseMessages.unauthorized);
      }
      return res.success(generateToken(user));
    })(req, res, next);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports.users_me_get = async (req, res) => res.success(req.user);

module.exports.users_get = async (req, res) => {
  try {
    const results = await users_get_schema.validateAsync(req.query);

    const count = results.count ? Number(results.count.trim()) : 10;
    const page = results.page ? Number(results.page.trim()) : 1;
    const sort = results.sort ? results.sort : 'name';
    const order = results.order ? results.order : 'asc';
    const q = results.q ? results.q : '';
    const type = results.type ? results.type : constants.userTypes.user;

    const users = await UserService.read({
      count,
      page,
      sort,
      order,
      q,
      type,
    });

    return res.success(users);
  } catch (error) {
    return res.serverError(error);
  }
};

// Profile Routes
module.exports.profile_put = async (req, res) => {
  try {
    const results = await profile_put_schema.validateAsync(req.body);

    await UserService.updateUserFullName(req.user._id, results.name);

    return res.success('Profile Updated');
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports.profile_change_password_post = async (req, res) => {
  try {
    const results = await users_change_password_post_schema.validateAsync(req.body);

    const isCurrentPasswordValid = await UserService.validatePassword(req.user._id, results.currentPassword);
    if (!isCurrentPasswordValid) return res.fail(responseMessages.notValidPassword);

    await UserService.updatePassword(req.user._id, results.password);

    return res.success('Password Updated');
  } catch (error) {
    return res.serverError(error);
  }
};
