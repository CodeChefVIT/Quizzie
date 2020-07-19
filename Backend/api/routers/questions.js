const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const cookieParser = require("cookie-parser");
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

router.use(cookieParser());

router.delete("/:questionId", async (req, res, next) => {
	await Question.deleteOne({ _id: req.params.questionId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Deleted",
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Couldn't delete",
			});
		});
});

router.get("/all/:quizId", checkAuth, async (req, res, next) => {
	await Question.find({ quizId: req.params.quizId })
		.then(async (result) => {
			res.status(200).json({
				result,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Some Error",
			});
		});
});

router;

router.post("/add", checkAuth, checkAuthAdmin, async (req, res, next) => {
	await Quiz.findById(req.body.quizId)
		.exec()
		.then(async (result1) => {
			new Question({
				_id: new mongoose.Types.ObjectId(),
				quizId: req.body.quizId,
				description: req.body.description,
				options: req.body.options,
				correctAnswer: req.body.correctAnswer,
			})
				.save()
				.then((result) => {
					res.status(201).json({
						message: "Created",
					});
				})
				.catch((err) => {
					res.status(400).json({
						message: "some error occurred",
					});
				});
		})
		.catch((err) => {
			res.status(400).json({
				message: "some error occurred123",
			});
		});
});

router.patch(
	"/update/:questionId",
	checkAuth,
	checkAuthAdmin,
	async (req, res, next) => {
		const updateOps = {};
		var flag = 0;
		for (const ops of req.body) {
			updateOps[ops.propName] = ops.value;
		}
		await Question.updateOne({ _id: req.params.questionId }, { $set: updateOps })
			.exec()
			.then((result) => {
				res.status(200).json({
					message: "Question updated",
				});
			});
	}
);

module.exports = router;
