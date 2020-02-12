require('dotenv').config();

const passport = require('passport');

const LocalStrategy = require('passport-local');

passport.use('login', new LocalStrategy(function (username, password, done) {
    console.log('passport LocalStrategy - login', { username, password });
    const data = { username, password };
    const user = {
        email: 'juana-perez@example.com',
        password: 'secret',
        name: 'Juana',
        lastname: 'Pérez',
    };
    return done(null, user);
}));

exports.authenticate = passport.authenticate('login', { failWithError: true, session: false });
exports.passport = passport;