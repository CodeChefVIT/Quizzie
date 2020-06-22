const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
				// already have this user
				const token = jwt.sign(
					{
						userType: currentUser.userType,
						userId: currentUser._id,
						email: currentUser.email,
						name: currentUser.name,
						mobileNumber: currentUser.mobileNumber,
					},
					process.env.jwtSecret,
					{
						expiresIn: "1d",
					}
				);
				User.updateOne(({_id:currentUser._id},{$set:{token}})).then((user)=>{
					console.log('user is: ', currentUser,token);
					done(null, currentUser);
				})

            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    username: profile.displayName
                }).save().then((newUser) => {
					const token = jwt.sign(
						{
							userType: currentUser.userType,
							userId: currentUser._id,
							email: currentUser.email,
							name: currentUser.name,
							mobileNumber: currentUser.mobileNumber,
						},
						process.env.jwtSecret,
						{
							expiresIn: "1d",
						}
					);
					User.updateOne(({_id:currentUser._id},{$set:{token}})).then((user)=>{
						console.log('user is: ', newUser);
						done(null, newUser);
					})
                });
            }
        });
    })
);