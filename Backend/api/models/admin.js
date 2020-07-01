const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const User = require("./user");

const adminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userType: { type: String, default: "Admin" },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },

  //personal details

  mobileNumber: {
    type: Number,
    match: /^([7-9][0-9]{9})$/g,
  },
  quizzes: [
    {
      quizId:{type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz" ,}
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
