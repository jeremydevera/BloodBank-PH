var FacebookStrategy = require('passport-facebook').Strategy; 
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User             = require('../models/user');
var session          = require('express-session');
var jwt  = require('jsonwebtoken');
var secret ='harrypotter'; 

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret: 'keyboard cat', proxy: true,saveUninitialized: true, resave: true, cookie: { secure: false }}));

    passport.serializeUser(function(user, done) {

        if(user.active){
            token = jwt.sign({username: user.username, _id: user._id}, secret, { expiresIn: '24h' });
            console.log(token);
        } else {
            token = 'inactive/error';
        }
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: '237589323517803',
        clientSecret: '68620e335657e6a42b3d8b84c1a3b818',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile._json.email }).select('username active password email').exec(function(err, user){
            if(err) done(err);

            if(user && user!=null) {
                done(null, user);
            } else {
                done(err);
            }
        });
      }
    ));

    passport.use(new TwitterStrategy({
        consumerKey: 'y5CE4DPVWgEQP4YKqKSIihSux',
        consumerSecret: 'SIEEAxkUU4Odqgfz2Af1GiMFjO7N4yz5VHGlGms25rzItxPL8m',
        callbackURL: "http://localhost:8080/auth/twitter/callback",
        userProfileURL:"https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
      },
      function(token, tokenSecret, profile, done) {
          User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user){
            if(err) done(err);

            if(user && user!=null) {
                done(null, user);
            } else {
                done(err);
            }
        });
      }
    ));


    passport.use(new GoogleStrategy({
        clientID: '552167221534-vvokv7mo47rig8vqiiiin8lchm6guu6b.apps.googleusercontent.com',
        clientSecret: 'R7CLUB5o3FbLwZzGgQm2I7Y1',
        callbackURL: "https://localhost:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {        
        User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user){
            if(err) done(err);

            if(user && user!=null) {
                done(null, user);
            } else {
                done(err);
            }
        });
    }
    ));

    app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
        res.redirect('/google/' + token);
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res){
        res.redirect('/twitter/' + token);
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook',{ failureRedirect: '/facebookerror' }), function(req, res){
        res.redirect('/facebook/' + token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook',{scope: 'email'}));

    return passport;
}