const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const Admin = require("./admin");


const studentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
    
  userType: { type: String, default: "User" },
  email: {
    type: String,
    required: true,
    unique: true,
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
      marks: { type: Number},
      responses: [],
    },
  ],
  quizzesEnrolled:[
    {
      quizId:{type:mongoose.Schema.Types.ObjectId,
      ref:"Quiz"}
    }
  ]
});

module.exports = mongoose.model("Student", studentSchema);
