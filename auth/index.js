require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const { DummyDatabase } = require('../databases');

const database = new DummyDatabase();

//--- login
const loginCallbackBuilder = (database) => async (req, username, password, done) => {
    const user = await database.find({ username, password });
    return done(null, user);// sera guardado en req.user
};

const loginCallback = loginCallbackBuilder(database);

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false,
}, loginCallback));
//---

exports.authenticate = passport.authenticate('login', { failWithError: true, session: false });
exports.passport = passport;