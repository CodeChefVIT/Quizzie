const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const Admin = require("./admin");

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	googleId: {
		type: String,
	},
	name: { type: String },

	userType: { type: String, default: "User" },
	email: {
		type: String,
		lowercase: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	mobileNumber: {
		type: Number,
		match: /^([7-9][0-9]{9})$/g,
	},
	password: { type: String },
	quizzesGiven: [
		{
			quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
			marks: { type: Number },
			responses: [],
      timeEnded: { type: Number },
      timeStarted:{type:Number}
		},
	],
	quizzesStarted: [
		{
			quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
		},
	],
	quizzesEnrolled: [
		{
			quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
		},
	],
	token: {
		type: String,
	},
	passResetKey: { type: String },
	passKeyExpires: { type: Number },
	verificationKey: { type: String },
	verificationKeyExpires: { type: Number },
	isEmailVerified: { type: Boolean ,default:false},
});

module.exports = mongoose.model("User", userSchema);
