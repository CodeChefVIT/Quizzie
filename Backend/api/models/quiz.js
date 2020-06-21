const mongoose = require("mongoose");
const Admin = require("./admin");
const Questions = require("./question");
const User = require("./user");

const QuizSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	quizName: { type: String, required: true },
	adminId: { type: mongoose.Schema.Types.ObjectID, ref: "Admin" },
	usersParticipated:[
		{
			userId:{type: mongoose.Schema.Types.ObjectID,
			ref: "User",}
		},
    ],
    usersEnrolled:[
		{
			userId:{type: mongoose.Schema.Types.ObjectID,
			ref: "User"}
		},
	],
});

module.exports = mongoose.model("Quiz", QuizSchema);
