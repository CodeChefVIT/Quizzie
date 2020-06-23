const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()

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
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
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
				console.log(token)
				console.log('profile',profile)


				User.findById(currentUser._id).then((result7)=>{
					result7.token = token
					result7.save().then((user)=>{
						console.log(user)
						done(null,user)
					}).catch((err)=>{
						console.log(err)
					})
				})
				// User.updateOne(({_id:currentUser._id},{$set:{token}})).then((result5)=>{
				// 	console.log(result5)
				// 	User.findById(currentUser._id).then((user)=>{
				// 		console.log('user is: ', user);
				// 		done(null, user);
				// 	}).catch((err)=>{
				// 		console.log(err)
				// 	})
				// }).catch((err)=>{
				// 	console.log(err)
				// })

            } else {
                // if not, create user in our db
                new User({
					_id: new mongoose.Types.ObjectId(),
                    googleId: profile.id,
					name: profile.displayName,
					email:profile._json.email
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
					console.log(token)
					User.findById(newUser._id).then((result7)=>{
						result7.token = token
						result7.save().then((user)=>{
							console.log(user)
							done(null,user)
						}).catch((err)=>{
							console.log(err)
						})
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