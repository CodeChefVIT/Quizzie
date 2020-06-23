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

const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/checkUser", checkAuth, async (req, res) => {
	User.find({ _id: req.user.userId })
		.exec()
		.then(async (result) => {
			if (result.length >= 1) {
				res.status(200).json({
					result,
				});
			} else {
				Admin.find({ _id: req.user.userId })
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
			}
		})
		.catch((err) => {
			res.status(400).json({
				error: "err",
			});
		});
});

module.exports = router;
