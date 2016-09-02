
var logger = require('log4js').getLogger();
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var UserDTO = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserDTO.findById(id, function(err, user) {
            done(err, user);
        });
    });


 passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {

        UserDTO.findOne({ 'username' :  username }, function(err, user) {
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user) {
                logger.info("Username " + username + " tried to log in. No such username exists.");
                return done(null, false, req.flash('loginMessage', 'Käyttäjää ei löydy.'));
            } 

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                logger.info("User " + user.username + " tried wrong password.");
                return done(null, false, req.flash('loginMessage', 'Väärä salasana.'));
            } 

            // all is well, return successful user
            return done(null, user);
        });

    }));

};