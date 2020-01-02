const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  // user.id refers to the ID given by mongoDB, not by google
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID : profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // already have a record with the same profile ID
            done(null, existingUser);
          } else {
            // no user with this ID
            new User({ googleID: profile.id }).save()
              .then(user => done(null, user));
          }
        });
    }
  )
);
