const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GooglePlusTokenStrategy = require('passport-google-plus-token')
// const JwtStrategy = require('passport-jwt').Strategy;
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




// passport.use(
//     new GoogleStrategy({

//         // options for google strategy
//         clientID: process.env.clientID,
//         clientSecret: process.env.clientSecret,
        // callbackURL: '/auth/google/redirect'
//     }, (accessToken, refreshToken, profile, done) => {
//         // check if user already exists in our own db
//         User.findOne({googleId: profile.id}).then((currentUser) => {
//             if(currentUser){
// 				// already have this user
// 				const token = jwt.sign(
// 					{
// 						userType: currentUser.userType,
// 						userId: currentUser._id,
// 						email: currentUser.email,
// 						name: currentUser.name,
// 						mobileNumber: currentUser.mobileNumber,
// 					},
// 					process.env.jwtSecret,
// 					{
// 						expiresIn: "1d",
// 					}
// 				);
// 				console.log(token)
// 				console.log('profile',profile)


// 				User.findById(currentUser._id).then((result7)=>{
// 					result7.token = token
// 					result7.save().then((user)=>{
// 						console.log(user)
// 						done(null,user)
// 					}).catch((err)=>{
// 						console.log(err)
// 					})
// 				})
// 				// User.updateOne(({_id:currentUser._id},{$set:{token}})).then((result5)=>{
// 				// 	console.log(result5)
// 				// 	User.findById(currentUser._id).then((user)=>{
// 				// 		console.log('user is: ', user);
// 				// 		done(null, user);
// 				// 	}).catch((err)=>{
// 				// 		console.log(err)
// 				// 	})
// 				// }).catch((err)=>{
// 				// 	console.log(err)
// 				// })

//             } else {
//                 // if not, create user in our db
//                 new User({
// 					_id: new mongoose.Types.ObjectId(),
//                     googleId: profile.id,
// 					name: profile.displayName,
// 					email:profile.emails[0].value
//                 }).save().then((newUser) => {
// 					const token = jwt.sign(
// 						{
// 							userType: newUser.userType,
// 							userId: newUser._id,
// 							email: newUser.email,
// 							name: newUser.name,
// 							mobileNumber: newUser.mobileNumber,
// 						},
// 						process.env.jwtSecret,
// 						{
// 							expiresIn: "1d",
// 						}
// 					);
// 					console.log(token)
// 					User.findById(newUser._id).then((result7)=>{
// 						result7.token = token
// 						result7.save().then((user)=>{
// 							console.log(user)
// 							done(null,user)
// 						}).catch((err)=>{
// 							console.log(err)
// 						})
// 					})
//                 }).catch((err)=>{
// 					console.log(err)
// 				})
//             }
//         }).catch((err)=>{
// 			console.log(err)
// 		})
//     })
// );

passport.use(new GoogleStrategy({
	clientID :process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: '/auth/google/redirect'
},async(accessToken,refreshToken,profile,done)=>{
	// check if user already exists in our own db

	console.log('accessToken',accessToken),
	console.log('profile',profile)
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
					isEmailVerified:newUser.isEmailVerified
				},
				process.env.jwtSecret,
				{
					expiresIn: "1d",
				}
			);
			// console.log(token)
			// console.log('user logged in',profile)


			User.findById(currentUser._id).then((result7)=>{
				result7.token = token
				result7.save().then((user)=>{
					console.log("Logged in",user)
					done(null,user)
				}).catch((err)=>{
					console.log(err)
				})
			})


		} else {
			// if not, create user in our db
			new User({
				_id: new mongoose.Types.ObjectId(),
				googleId: profile.id,
				name: profile.displayName,
				email:profile.emails[0].value,
				isEmailVerified:true
			}).save().then((newUser) => {
				const token = jwt.sign(
					{
						userType: newUser.userType,
						userId: newUser._id,
						email: newUser.email,
						name: newUser.name,
						mobileNumber: newUser.mobileNumber,
						isEmailVerified:newUser.isEmailVerified
					},
					process.env.jwtSecret,
					{
						expiresIn: "1d",
					}
				);
				// console.log(token)
				User.findById(newUser._id).then((result7)=>{
					result7.token = token
					result7.save().then((user)=>{
						console.log("user created",user)
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
}))





// const cookieExtractor = req => {
// 	let token = null;
// 	if (req && req.cookies) {
// 	  token = req.cookies['access_token'];
// 	}
// 	return token;
//   }
  
//   // JSON WEB TOKENS STRATEGY
//   passport.use(new JwtStrategy({
// 	jwtFromRequest: cookieExtractor,
// 	secretOrKey: process.env.jwtSecret,
// 	passReqToCallback: true
//   }, async (req, payload, done) => {
// 	try {
// 	  // Find the user specified in token
// 	  const user = await User.findById(payload.sub);
  
// 	  // If user doesn't exists, handle it
// 	  if (!user) {
// 		return done(null, false);
// 	  }
  
// 	  // Otherwise, return the user
// 	  req.user = user;
// 	  done(null, user);
// 	} catch(error) {
// 	  done(error, false);
// 	}
//   }));
  
//   // Google OAuth Strategy
//   passport.use('googleToken', new GooglePlusTokenStrategy({
// 	clientID: process.env.clientID,
// 	clientSecret: process.env.clientSecret,
// 	passReqToCallback: true,
//   }, async (req, accessToken, refreshToken, profile, done) => {
// 	try {
// 	  // Could get accessed in two ways:
// 	  // 1) When registering for the first time
// 	  // 2) When linking account to the existing one
  
// 	  // Should have full user profile over here
// 	  console.log('profile', profile);
// 	  console.log('accessToken', accessToken);
// 	  console.log('refreshToken', refreshToken);
  
// 	  if (req.user) {
// 		// We're already logged in, time for linking account!
// 		// Add Google's data to an existing account
// 		req.user = {
// 		  googleId: profile.id,
// 		  email: profile.emails[0].value,
// 		  name : profile.displayName
// 		}
// 		await req.user.save()
// 		return done(null, req.user);
// 	  } else {
// 		// We're in the account creation process
// 		let existingUser = await User.findOne({ "google.id": profile.id });
// 		if (existingUser) {
// 		  return done(null, existingUser);
// 		}
  
// 		// Check if we have someone with the same email
// 		existingUser = await User.findOne({ "local.email": profile.emails[0].value })
// 		if (existingUser) {
// 		  // We want to merge google's data with local auth
// 		  existingUser= {
// 			googleId: profile.id,
// 			email: profile.emails[0].value,
// 			name:profile.displayName
// 		  }
// 		  await existingUser.save()
// 		  return done(null, existingUser);
// 		}
// 		else{		
// 		const newUser = new User({
// 			_id: new mongoose.Types.ObjectId(),
// 			googleId: profile.id,
// 			email: profile.emails[0].value,
// 			name:profile.displayName
// 		});
	
// 		await newUser.save();
// 		done(null, newUser);
// 		console.log(newUser)
// 	}

// 	  }
// 	} catch(error) {
// 	console.log(error)
// 	}
//   }));
  