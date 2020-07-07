const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
//const sharp = require('sharp');
const Admin = require("../models/admin");
const Quiz = require("../models/quiz");
const User = require("../models/user");

const checkAuth = require("../middleware/checkAuth");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const checkAuthUser = require("../middleware/checkAuthUser");

const router = express.Router();

//signup
router.post("/signup", async (req, res, next) => {
	Admin.find({ email: req.body.email })
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
						const user = new Admin({
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

//login
router.post("/login", async (req, res, next) => {
	Admin.find({ email: req.body.email })
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

//Admin profile
router.get("/", checkAuthAdmin, checkAuth, async (req, res, next) => {
	await Admin.findById(req.user.userId)
		.populate({
			path: "quizzes",

			populate: { path: "quizId" },
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

router.get("/hey", (req, res, next) => {
	res.send("he;llo");
});

////Update admin profile
router.patch("/updateProfile", checkAuth, checkAuthAdmin, (req, res, next) => {
	const id = req.user.userId;
	const updateOps = {};
	var flag = 0;
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Admin.updateOne({ _id: id }, { $set: updateOps })
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

///all quizzess created by the admin
router.get("/created", checkAuthAdmin, checkAuth, async (req, res, next) => {
	await Quiz.find({ adminId: req.user.userId })
		.populate({
			path: "usersEnrolled",

			populate: { path: "userId" },
		})
		.exec()
		.then(async (result) => {
			res.status(200).json({
				result,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: err,
			});
		});
});

///Number of students enrolled in a particular quiz
router.get(
	"/studentsEnrolled/:quizId",
	checkAuth,
	checkAuthAdmin,
	async (req, res, next) => {
		await Quiz.findById(req.params.quizId)
			.populate({
				path: "usersEnrolled",

				populate: { path: "userId" },
			})
			.exec()
			.then(async (result1) => {
				res.status(200).json({
					result1,
				});
			})
			.catch((err) => {
				res.status(400).json({
					message: err,
				});
			});
	}
);

router.patch(
	"/changePassword",
	checkAuth,
	checkAuthAdmin,
	async (req, res, next) => {
		await Admin.findOne({ _id: req.user.userId })
			.then(async (result) => {
				bcrypt.compare(req.body.password, result.password, (err, result1) => {
					if (err) {
						return res.status(401).json({
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
							Admin.updateOne({ _id: req.user.userId }, { $set: { password: hash } })
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

////Delete profile
// router.delete(
// 	"/",
// 	checkAuth,
// 	checkAuthAdmin,
// 	async (req, res, next) => {
// 		await Admin.findById(req.user.userId)
// 			.exec()
// 			.then(async(result) => {
//                 const numQuizzes = result.quizzes.length
//                 for(i=0;i<numQuizzes;i++){
// 					const currentQuiz = result.quizzes[i].quizId
// 					await Quiz.findById(currentQuiz)
// 					.exec()
// 					.then(async(result1)=>{
// 						const numOfUsers = result1.usersEnrolled.length
// 						for(j=0;j<numOfUsers;j++){
// 							const currUser = result1.usersEnrolled[j].userId
// 							await User.updateOne({_id:currUser},
// 												{ $pull: { quizzesEnrolled: { quizId: currentQuiz } } }
// 												).then(async(result3)=>{
// 													await Question.deleteMany({quizId:currentQuiz})
// 													.then(async(result4)=>{
// 														await Quiz.deleteOne({_id:currentQuiz}).then(async(result5)=>{
// 														})
// 													})
// 													.catch(async(err)=>{
// 														await res.status(400).json({
// 															message:"some error occurred"
// 														})
// 													})
// 												}).catch(async(err)=>{
// 													await res.status(400).json({
// 														message:"Unexpected Erro"
// 													})
// 												})
// 						}
// 					})
// 					.catch(async(err)=>{
// 						await res.status(400).json({
// 							message:'Unexpected Err'
// 						})
// 					})
// 				}
// 				await Admin.deleteOne({_id:req.user.userId})
// 				.then(async(result6)=>{
// 					await res.status(200).json({
// 						message:'Successfully Deleted'
// 					})
// 				})
// 				.catch(async(err)=>{
// 					await res.status(400).json({
// 						message:'Some error'
// 					})
// 				})

//             })
// 			.catch(async(err)=>{
// 				await res.status(400).json({
// 					message:'Unexpected Erroor'
// 				})
// 			});
// 	}
// );

module.exports = router;
