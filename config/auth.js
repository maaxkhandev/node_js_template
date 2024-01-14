const passport = require('passport');
const constants = require('./constants');

module.exports.ensureAuthenticated =
  (userType = constants.userTypes.any) =>
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res.fail('Unauthorized');
      }
      if (!user) {
        console.log('User not found');
        return res.fail('Unauthorized');
      }
      if (userType !== constants.userTypes.any) {
        if (user.type !== userType) {
          console.log('user type do not mtach');
          return res.fail(`You need ${userType} privilages to access this route.`);
        }
      }

      req.user = user;
      return next();
    })(req, res, next);
  };
