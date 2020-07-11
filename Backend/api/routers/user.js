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

const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");

const router = express.Router();

////Signup
router.post("/signup", async (req, res, next) => {
	console.log("signup");
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				res.status(409).json({
					message: "Email already exists",
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						console.log("ashf");
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							name: req.body.name,
							mobileNumber: req.body.mobileNumber,
						});
						user
							.save()
							.then((result) => {
								res.status(201).json({
									message: "user created",
									userDetails: {
										userId: result._id,
										email: result.email,
										name: result.name,
										mobileNumber: result.mobileNumber,
									},
								});
							})
							.catch((err) => {
								res.status(500).json({
									error: err,
								});
							});
					}
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

//Auth with google

router.get("/logout", async (req, res, next) => {});

////Login
router.post("/login", async (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length < 1) {
				return res.status(401).json({
					message: "Auth failed: Email not found probably",
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "Auth failed",
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							userType: user[0].userType,
							userId: user[0]._id,
							email: user[0].email,
							name: user[0].name,
							mobileNumber: user[0].mobileNumber,
						},
						process.env.jwtSecret,
						{
							expiresIn: "1d",
						}
					);

					return res.status(200).json({
						message: "Auth successful",
						userDetails: {
							userType: user[0].userType,
							userId: user[0]._id,
							name: user[0].name,
							email: user[0].email,
							mobileNumber: user[0].mobileNumber,
						},
						token: token,
					});
				}
				res.status(401).json({
					message: "Auth failed1",
				});
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get("/google", (req, res, next) => {
	res.send("Welcome you are logged in as " + req.user);
});

router.get("/hello", (req, res, next) => {
	res.send("HELLO");
});

////Get Profile

router.get("/", checkAuthUser, checkAuth, async (req, res, next) => {
	await User.findById(req.user.userId)
		.populate({
			path: "quizzesEnrolled",

			populate: { path: "quizId", populate: { path: "adminId" } },
		})
		.exec()
		.then(async (result1) => {
			res.status(200).json({
				result1,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Error",
			});
		});
});

router.get(
	"/quizzesGiven",
	checkAuth,
	checkAuthUser,
	async (req, res, next) => {
		await User.findById(req.user.userId)
			.populate({
				path: "quizzesGiven",

				populate: { path: "quizId", populate: { path: "adminId" } },
			})
			.exec()
			.then((result) => {
				res.status(200).json({
					result: result.quizzesGiven,
				});
			})
			.catch((err) => {
				res.status(400).json({
					err,
				});
			});
	}
);

//Update user profile
router.patch("/updateProfile", checkAuth, checkAuthUser, (req, res, next) => {
	const id = req.user.userId;
	const updateOps = {};
	var flag = 0;
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	User.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Profile updated",
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.patch(
	"/changePassword",
	checkAuth,
	checkAuthUser,
	async (req, res, next) => {
		await User.findOne({ _id: req.user.userId })
			.then(async (result) => {
				bcrypt.compare(req.body.password, result.password, (err, result1) => {
					if (err) {
						return res.status(500).json({
							message: "Auth failed",
						});
					}
					if (result1) {
						bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
							if (err) {
								res.status(400).json({
									err,
								});
							}

							User.updateOne({ _id: req.user.userId }, { $set: { password: hash } })
								.then((result) => {
									res.status(200).json({
										message: "Password changed",
									});
								})
								.catch((err) => {
									res.status(400).json({
										message: "error",
									});
								});
						});
					} else {
						return res.status(401).json({
							message: "Auth failed",
						});
					}
				});
			})
			.catch((err) => {
				res.status(400).json({
					err,
				});
			});
	}
);


router.get("/studentQuizResult/:quizId",checkAuth,checkAuthUser,async(req,res,next)=>{
	const studentId = req.user.userId
	if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
		
	  
	const user = await User.findById(studentId)
	const quizLength = user.quizzesGiven.length
	const quizId=req.params.quizId
	for(i=0;i<quizLength;i++){
		if(quizId==user.quizzesGiven[i].quizId){
			res.status(200).json({
				messgae:"Retrieved",
				result:user.quizzesGiven[i]
			})
		}
	}
	res.status(400).json({
		message:"Quiz not found in Database"
	})
}
});

module.exports = router;
