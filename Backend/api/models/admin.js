const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const User = require("./user");

const adminSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userType: { type: String, default: "Admin" },
  name: { type: String, required: true },
  googleId: { type:Number },
	email: {
		type: String,
		required: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	password: { type: String},

	mobileNumber: {
		type: Number,
		match: /^([7-9][0-9]{9})$/g,
	},
	quizzes: [
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

module.exports = mongoose.model("Admin", adminSchema);
