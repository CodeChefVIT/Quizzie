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

const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");

const router = express.Router();

router.post(
	"/createQuiz",
	checkAuth,
	checkAuthAdmin,
	async (req, res, next) => {
		const quiz = new Quiz({
			_id: new mongoose.Types.ObjectId(),
			quizName: req.body.quizName,
            adminId: req.user.userId,
            quizDate:req.body.quizDate,
            quizTime:req.body.quizTime,
            quizDuration:req.body.quizDuration,
		});
		////////////////////////////Add quiz to teacher model/////////////////////////
		quiz
			.save()
			.then(async (result) => {
				const quizId = result._id;
				Admin.updateOne(
					{ _id: req.user.userId },
					{ $push: { quizzes: { quizId } } }
				)
					.then(async (result1) => {
						res.status(201).json({
							message: "created",
							result,
						});
					})
					.catch(async (err) => {
						res.status(400).json({ error: "err1" });
					});
			})
			.catch((err) => {
				res.status(400).json({ error: "err" });
			});
	}
);

router.get("/all", checkAuth, async (req, res, next) => {
	Quiz.find()
		.populate("adminId")
		.select("-__v")
		.exec()
		.then(async (result) => {
			await res.status(200).json({
				message: "Successfully retrieved",
				result,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "An error occurred",
			});
		});
});

router.patch("/enroll", checkAuth, checkAuthUser, async (req, res, next) => {
	Quiz.findById(req.body.quizId)
		.exec()
		.then(async (result2) => {
			for (i = 0; i < result2.usersEnrolled.length; i++) {
				if (result2.usersEnrolled[i].userId == req.user.userId) {
					return res.status(409).json({ message: "Already enrolled" });
				}
			}
			const userId = req.user.userId;
			const quizId = req.body.quizId;
			await Quiz.updateOne(
				{ _id: quizId },
				{ $push: { usersEnrolled: { userId } } }
			)
				.exec()
				.then(async (result) => {
					await User.updateOne(
						{ _id: userId },
						{ $push: { quizzesEnrolled: { quizId } } }
					)
						.then(async (result1) => {
							await res.status(200).json({
								message: "Enrolled",
							});
						})
						.catch(async (err) => {
							res.status(400).json({
								message: "Some error",
							});
						});
				});
		})
		.catch(async (err) => {
			res.status(404).json({
				message: err,
			});
		})

		.catch(async (err) => {
			res.status(404).json({
				message: err,
			});
		});
});

module.exports = router;
