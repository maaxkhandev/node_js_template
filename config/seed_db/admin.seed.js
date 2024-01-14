const constants = require('../constants');
const { defaultAdmin } = require('../defaults');
const UserService = require('../../services/user.service');

module.exports = async () => {
  const admin = await UserService.findByEmail(defaultAdmin.email);
  if (!admin) {
    console.log('Admin User not found. Making now');

    await UserService.addUser({
      userName: defaultAdmin.userName,
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      type: constants.userTypes.admin,
      password: defaultAdmin.password,
      active: true,
      details: {},
    });
  }
  return;
};
