const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const Admin = require("./admin");
const User = require("./user");

const ownerSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String },

	userType: { type: String, default: "Owner" },
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
	boardPosition: { type: String },
	token: {
		type: String,
	},
});

module.exports = mongoose.model("Owner", ownerSchema);
