const mongoose = require("mongoose");
const Admin = require("./admin");
const Quiz = require("./quiz");
const User = require("./user");

const questionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	quizId: { type: mongoose.Schema.Types.ObjectID, ref: "Quiz" },
	description: {
		type: String,
		required: true,
	},
	options: [
		{
			text: {
				type: String,
				required: true,
			},
		},
	],
	correctAnswer: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Question", questionSchema);
