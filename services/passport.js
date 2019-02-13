const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

// We take the mongoose model instance and pass the id to the cookie
passport.serializeUser((user, done) => {
  done(
    null,
    user.id /* not profile id. It is the id assigned to this record by mongodb. Actaually a shortcut to user.__id.oid */
  );
});

// We take the id passed to us by the cookie and turn it back as a user model
passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  })
  .catch(err => console.log(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({
        googleId: profile.id
      }).save();
      done(null, user);
    }
  )
);
