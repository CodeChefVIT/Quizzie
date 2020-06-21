const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
//const sharp = require('sharp');
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const User = require("../models/user");
const Question = require("../models/question");

const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");

const router = express.Router();

router.get("/all/:quizId", checkAuth, checkAuthUser, async (req, res, next) => {
	Quiz.findById(req.params.quizId)
		.exec()
		.then(async (result) => {
			for (i = 0; i < result.usersEnrolled.length; i++) {
				if (result.usersEnrolled[i].userId != req.user.userId) {
					return res.status(401).json({
						message: "You are not enrolled for this quiz,sorry",
					});
				}
			}
			for (i = 0; i < result.usersParticipated.length; i++) {
				if (usersParticipated[i].userId == req.user.userId) {
					return res.status(401).json({
						message: "Quiz already submitted",
					});
				}
			}
			Question.find({ quizId: req.params.quizId })
				.exec()
				.then(async (result1) => {
					res.status(200).json({
						message: "Retrieved",
						questions: result1,
					});
				})
				.catch((err) => {
					res.status(400).json({
						message: "erro",
					});
				});
		})
		.catch(async (err) => {
			res.status(400).json({
				message: "Internal error",
			});
		});
});

router.post("/add", checkAuth, checkAuthAdmin, async (req, res, next) => {
	await Quiz.findById(req.body.quizId)
		.exec()
		.then(async (result) => {
			if (result1.adminId != req.user.userId) {
				return res.status(401).json({
					message: "This is not your quiz",
				});
			}

			const question = new Question({
				quizId: req.body.quizId,
				description: req.body.description,
				options: req.body.options,
				correctAnswer: req.body.correctAnswer,
			});

			await question.save();
		})
		.catch((err) => {});
});

module.exports = router;
