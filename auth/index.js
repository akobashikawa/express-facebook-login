require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;

const axios = require('axios');

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
    console.log('facebookCallback', { accessToken, refreshToken, profile });
    const user = await database.find({ facebookId: profile.id });
    return cb(null, user);// sera guardado en req.user
};

const facebookCallback = facebookCallbackBuilder(database);

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/facebook-callback`,
    profileFields: ['id', 'email'],
}, facebookCallback));

exports.facebookAuthenticate = passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_gender', 'user_birthday'] });
//---

const facebookValidateBuilder = (database) => async (req, res, next) => {
    const inputToken = req.query['access_token'] || '';
    try {
        // const response_ = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}`);
        // console.log(response_.data);
        // const accessToken = response_.data;

        const { data } = await axios.get(`https://graph.facebook.com/me?access_token=${inputToken}`);
        // const { data } = await axios.get(`https://graph.facebook.com/me?debug_token?input_token=${inputToken}&access_token=${accessToken}`);
        console.log(data);
        const user = await database.find({ facebookId: data.id });
        req.user = user;
        next();
    } catch (error) {
        // console.log(error);
        console.log(error.response);
        next();
    }
};

exports.facebookValidate = facebookValidateBuilder(database);

exports.passport = passport;