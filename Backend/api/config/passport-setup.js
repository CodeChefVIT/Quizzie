const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
		console.log(user)
        done(null, user);
    }).catch((err)=>{
		console.log(err)
	})
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
				}).catch((err)=>{
					console.log(err)
				})

            } else {
                // if not, create user in our db
                new User({
					_id: new mongoose.Types.ObjectId(),
                    googleId: profile.id,
                    username: profile.displayName
                }).save().then((newUser) => {
					const token = jwt.sign(
						{
							userType: newUser.userType,
							userId: newUser._id,
							email: newUser.email,
							name: newUser.name,
							mobileNumber: newUser.mobileNumber,
						},
						process.env.jwtSecret,
						{
							expiresIn: "1d",
						}
					);
					User.updateOne(({_id:newUser._id},{$set:{token}})).then((user)=>{
						console.log('user is: ', newUser);
						done(null, newUser);
					}).catch((err)=>{
						console.log(err)
					})
                }).catch((err)=>{
					console.log(err)
				})
            }
        }).catch((err)=>{
			console.log(err)
		})
    })
);