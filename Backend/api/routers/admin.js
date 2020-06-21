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




///all quizzess created by the admin
router.get("/created", checkAuthAdmin, checkAuth, async (req, res, next) => {
	await Quiz.find({ adminId: req.user.userId })
		.exec()
		.then(async (result) => {
			res.status(200).json({
				result,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Error",
			});
		});
});




///Number of students enrolled in a particular quiz
router.get('/studentsEnrolled/:quizId',checkAuth,checkAuthAdmin,async(req,res,next)=>{
	await Quiz.findById(req.params.quizId)
	.populate({
        path: "usersEnrolled",

        populate: { path: "user" },
	  })
	.exec()
	.then(async(result1)=>{
		if(result1.adminId!=req.user.userId){
			return res.status(401).json({
				message:"This is not your quiz"
			})
		}
		res.status(200).json({
			result1
		})
	})
	.catch((err)=>{
		res.status(400).json({
			message:err
		})
	})
	  
})

module.exports = router;
