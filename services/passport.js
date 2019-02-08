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
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // we already have a user with the given profile ID
          done(null, existingUser); // this tells passport that err = null and we found the user ${existingUser}
        } else {
          // We don't have a user with the given profile ID
          // We create a new model instance in js and save it to the database by chaining save()
          new User({
            googleId: profile.id
          })
            .save()
            .then(user => done(null, user)); // tells passport that every went good and we created the user ${user}
        }
      });
    }
  )
);
