require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;


const { DummyDatabase } = require('../databases');

const database = new DummyDatabase();

//--- local
const localCallbackBuilder = (database) => async (req, username, password, cb) => {
    // return cb(new Error('Authentication error'));

    const user = await database.find({ username, password });
    return cb(null, user);// sera guardado en req.user
};

const localCallback = localCallbackBuilder(database);

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false,
}, localCallback));

exports.authenticate = passport.authenticate('local', { failWithError: true, session: false });
//---


//--- facebook
const facebookCallbackBuilder = (database) => async (accessToken, refreshToken, profile, cb) => {
    const user = await database.find({ facebookId: profile.id });
    return cb(null, user);// sera guardado en req.user
};

const facebookCallback = facebookCallbackBuilder(database);

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/auth/facebook-callback"
}, facebookCallback));

exports.facebookAuthenticate = passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_gender', 'user_birthday'] });
//---


exports.passport = passport;