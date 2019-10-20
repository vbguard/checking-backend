/* eslint-disable func-names */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const jwtSecretKey = require('../config/config').JWT_SECRET_KEY;
const Users = require('../server/models/user.model');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then(user => {
          if (!user)
            return done(null, false, {
              errors: { message: 'Incorrect email or password' }
            });

          user.comparePassword(password, (err, isMatch) => {
            if (!isMatch)
              return done(null, false, {
                message: 'Incorrect email or password'
              });

            if (isMatch && !err) {
              user.getJWT();
              const userData = user.getPublicFields();
              return done(null, userData, {
                message: 'Logged In Successfully'
              });
            }
          });
        })
        .catch(done);
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecretKey
    },
    (jwtPayload, cb) => {
      // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      Users.findById(jwtPayload.id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, (err, user) => {
    done(err, user);
  });
});
