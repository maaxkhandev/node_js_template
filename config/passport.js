const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const UserService = require('../services/user.service');

module.exports = function (passport) {
  passport.use(localLogin);
  passport.use(jwtLogin);
};

// Local Strategy - Used for Login
const localLogin = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },

  async (email, password, done) => {
    // Match user
    try {
      let user = await UserService.findByEmail({ email });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      const validate = await user.isValidPassword(password);
      if (!validate) {
        return done(null, false, { message: 'Wrong Password' });
      }

      user = user.toJSON();
      return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
      return done(error);
    }
  }
);

// JWT Strategy - Used for token authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await UserService.findById(jwtPayload.id).lean();
    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    done(err, false);
  }
});
