const passport = require('passport');

module.exports.ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log(user);
    if (err) {
      return res.fail('Unauthorized');
    }
    if (!user) {
      return res.fail('Unauthorized');
    }
    req.user = user;
    return next();
  })(req, res, next);
};
