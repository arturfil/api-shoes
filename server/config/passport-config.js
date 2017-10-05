const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model');

//serializeUser; what to save in the session after loggin in
passport.serializeUser((userFromDb, done) => {
  done(null, userFromDb._id);
});

//deserializeUser: what will become "req.user" on every request
passport.deserializeUser((idFromSession, done) => {
  UserModel.findById(
    idFromSession,
    (err, userFromDb) => {
      if (err) {
        done(err);
        return;
      }

      done(null, userFromDb);
      // "userFromDb" becomes "req.user" in our routes
    }
  )
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'loginUsername',
      passwordField: 'loginPassword'
    },

    (sentUsername, sentPassword, done) => {
      UserModel.findOne(
        {username: sentUsername },
        (err, userFromDb) => {
          if (err) {
            done(err);
            return;
          }

          if (!userFromDb) {
            //"false" tells Passport that the login failed
            done(null, false, { message: 'Bad username '});
            return;
          }

          const isPasswordGood =
            bcrypt.compareSync(sentPassword, userFromDb.encryptedPassword);

          if (!isPasswordGood) {
            //"false" tells passport that the login failed
            done(null, false, {message: "BAd password "});
            return;
          }

          //if we get all up to this point, login was succesful!
          // make "userFromDb" the logged in user
          done(null, userFromDb);
        }
      ); // UserModel.findOne()
    }
  ) // new LocalStrategy
)
