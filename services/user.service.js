const User = require('../models/User');

module.exports.addUser = ({ userName, name, email, type, password, details, active }) =>
  new Promise(async (resolve, reject) => {
    try {
      const foundUser = await User.findOne({ email });
      if (foundUser) return reject('The email is used by another user');

      const newUser = new User({
        userName: userName.trim(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(),
        type: type.toLowerCase().trim(),
        details,
        active,
      });
      await newUser.save();

      console.log(`User Service: Added New User [${newUser._id}] of type [${type}]`);
      return resolve(newUser);
    } catch (error) {
      console.log('User Service [addUser] Error: ', error);
      return reject(error);
    }
  });

module.exports.find = (filters) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.find(filters);

      return resolve(user);
    } catch (error) {
      console.log('User Service [find] Error: ', error);
      return reject(error);
    }
  });

module.exports.findByEmail = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      return resolve(user);
    } catch (error) {
      console.log('User Service [findByEmail] Error: ', error);
      return reject(error);
    }
  });

module.exports.findById = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);

      return resolve(user);
    } catch (error) {
      console.log('User Service [findById] Error: ', error);
      return reject(error);
    }
  });

// module.exports.findByUserName = (userName) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const user = await User.findOne({ userName: userName.trim() });

//       resolve(user);
//     } catch (error) {
//       console.log('User Service [findByUserName] Error: ', error);
//       reject(error);
//     }
//   });

module.exports.updateDetails = (userId, detailKey, detailValue) =>
  new Promise(async (resolve, reject) => {
    try {
      const foundUser = await User.findById(userId);
      await User.findByIdAndUpdate(userId, {
        details: {
          ...foundUser.details,
          [detailKey]: detailValue,
        },
      });

      console.log(`User Service: User Detail [${detailKey}] Updated`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [updateDetails] Error: ', error);
      reject(error);
    }
  });

module.exports.updateUserFullName = (userId, name) =>
  new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(userId, {
        name,
      });

      console.log(`User Service: User Name [${name}] Updated`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [updateUserFullName] Error: ', error);
      reject(error);
    }
  });

module.exports.updateUserEmail = (userId, email) =>
  new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(userId, {
        email,
      });

      console.log(`User Service: User Email [${email}] Updated`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [updateUserEmail] Error: ', error);
      reject(error);
    }
  });

module.exports.setActive = (userId, active) =>
  new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(userId, {
        active,
      });

      console.log(`User Service: User Deactivated [${userId}]`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [deactivateUser] Error: ', error);
      reject(error);
    }
  });

module.exports.deleteUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(userId, {
        name: '',
        details: {},
        deleted: true,
        deletedAt: new Date(),
      });

      console.log(`User Service: User Deactivated [${userId}]`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [deactivateUser] Error: ', error);
      reject(error);
    }
  });

module.exports.read = ({ count, page, sort, order, q, type }) =>
  new Promise(async (resolve, reject) => {
    try {
      const mongoQuery = User.find({ type: type.toLowerCase().trim() });

      if (q != '') {
        const qRegEx = new RegExp(q, 'gi');
        mongoQuery.where({ $or: [{ name: qRegEx }, { email: qRegEx }] });
      }

      const total = await User.countDocuments(mongoQuery);

      const users = await mongoQuery
        .sort({ [sort]: order })
        .skip((page - 1) * count)
        .limit(count)
        .select('-password')
        .lean()
        .exec();

      return resolve({ users, total, page, pages: Math.ceil(total / count) });
    } catch (error) {
      console.log('User Service [getUsers], Error: ', error);
      return reject(error);
    }
  });

module.exports.readAll = (type) =>
  new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({ type }).select('-password').sort({ name: 'asc' }).lean();

      return resolve(users);
    } catch (error) {
      console.log('User Service [readAll], Error: ', error);
      return reject(error);
    }
  });

module.exports.validatePassword = (userId, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const foundUser = await User.findById(userId);
      const validation = foundUser.isValidPassword(password);

      return resolve(validation);
    } catch (error) {
      console.log('User Service [validatePassword], Error: ', error);
      return reject(error);
    }
  });

module.exports.updatePassword = (userId, password) =>
  new Promise(async (resolve, reject) => {
    try {
      await User.findByIdAndUpdate(userId, { password });

      console.log(`User Service: User [${userId}] Password Updated`);
      return resolve('Updated');
    } catch (error) {
      console.log('User Service [updatePassword], Error: ', error);
      return reject(error);
    }
  });
