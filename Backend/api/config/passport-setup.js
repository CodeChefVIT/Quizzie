const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const keys = require("./keys");

passport.use(
	new GoogleStrategy(
		{
			// options for google strategy

			callbackURL: "/auth/google/redirect",
			clientID: keys.google.clientID /* add your client ID here */,
			clientSecret: keys.google.clientSecret /* add your client secret here */,
		},
		(accessToken, refreshToken, profile, done) => {
			console.log(profile);
			new User({
				_id: new mongoose.Types.ObjectId(),
				name: profile._json.name,
				email: profile._json.email,
				googleId: profile.id,
			})
				.save()
				.then(async (result) => {
					const token = jwt.sign(
						{
							userType: result.userType,
							userId: result._id,
							email: result.email,
							name: result.name,
							mobileNumber: result.mobileNumber,
						},
						keys.jwtSecret,
						{
							expiresIn: "1d",
						}
					);

                
					console.log("new user created", result,'token',token);
				});
		}
	)
);
