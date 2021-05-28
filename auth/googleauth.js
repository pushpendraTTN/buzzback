var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const clientId = require('../config/gauthConfig').clientId;
const clientSecret = require('../config/gauthConfig').clientSecret;
const passport = require('passport');
const mongoose = require('mongoose');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "http://localhost:8000/auth/google/callback"
    }, (request,accessToken, refreshToken,profile, done) => { 
        // console.log(profile);
        // User.findOne({ email: profile.emails[0].value }).then((data) => {
        //     if (data) {
        //         return done(null, data);
        //     } else {
        //        User({
        //             name: profile.displayName,
        //             email: profile.emails[0].value,
        //             profilePic: profile.photos[0].value
        //         }).save(function (err,data) {
        //             console.log(err);
        //             // return done(null,data);
        //         });
        //     }
        //     return done(null,data);
        // } );
        // if (profile._json.domain === "tothenew.com") {

            User.findOne({
                email: profile.emails[0].value
            }, (err, user) => {
                if (user) {
                    return done(null, user)
                } else {
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        profilePic: profile.photos[0].value,
                    }, (err, user) => {
                        return done(null, user);
                    })
                }
            })
        // }
        //  else {
        //     return done(null);
        // }
    }));
    }


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, user) {
            done(err, user);
        });
    });

          
