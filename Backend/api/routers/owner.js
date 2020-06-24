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
const Owner = require('../models/owner')

const checkAuth = require("../middleware/checkAuth");
const checkAuthOwner = require("../middleware/checkAuthOwner");


const router = express.Router();

router.post('/signup',async(req,res,next)=>{
    Owner.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				res.status(409).json({
					message: "Email already exists",
				});
            } 
            else if(req.body.signupCode!=process.env.ownerKey){
                return res.status(400).json({
                    message:"Incorrect signup code"
                })
            }
            else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err,
						});
					} else {
						const user = new Owner({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							name: req.body.name,
                            mobileNumber: req.body.mobileNumber,
                            boardPosition:req.body.boardPosition,
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
                                        boardPosition:result.boardPosition,
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
})


router.post('/login',async(req,res,next)=>{
    Owner.find({ email: req.body.email })
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
                            boardPosition:user[0].boardPosition
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
                            boardPosition:  user[0].boardPosition,
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
})

module.exports = router;
