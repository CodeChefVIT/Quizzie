const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const passport = require("passport");
//const sharp = require('sharp');
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const User = require("../models/user");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require("constants");
const user = require("../models/user");

const router = express.Router();

router.use(cookieParser());

router.get(
	"/google",
	passport.authenticate("googleAdmin", {
		scope: ["profile", "email"],
	})
);

///Callback route for google to redirect
router.get(
	"/google/redirect",
	passport.authenticate("googleAdmin"),
	(req, res, next) => {
		const x = req.user;
		var token = encodeURIComponent(req.user.token);
		var name = encodeURIComponent(req.user.name);
		res.redirect(
			303,
			"https://quizzie.codechefvit.com/?name=" + name + "&token=" + token
		);
	}
);

module.exports = router;
