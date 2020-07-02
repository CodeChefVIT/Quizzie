const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const passport = require("passport");
//const sharp = require('sharp');
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const Owner = require("../models/owner");

const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/checkUser", checkAuth, async (req, res) => {
	if (req.user.userType == "User") {
		User.findById(req.user.userId)
			.select('-password')
			.populate({ path: "quizzesEnrolled", populate: { path: "quizId" } })
			.exec()
			.then(async (result) => {
				res.status(200).json({
					result,
				});
			})
			.catch((err) => {
				res.status(400).json({
					error: err,
				});
			});
	} else if (req.user.userType == "Admin") {
		Admin.findById(req.user.userId)
			.select('-password')
			.populate({ path: "quizzes", populate: { path: "quizId" } })
			.exec()
			.then((result) => {
				res.status(200).json({
					result,
				});
			})
			.catch((err) => {
				res.status(400).json({
					error: err,
				});
			});
	} else {
		Owner.findById(req.user.userId)
			.select('-password')
			.exec()
			.then((result) => {
				res.status(200).json({
					result,
				});
			})
			.catch((err) => {
				res.status(400).jsonn({
					error: err,
				});
			});
	}

});

module.exports = router;
