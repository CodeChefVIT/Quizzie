const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const request = require("request");
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
const verifyURL = require("../middleware/verifyURL");

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

router.post("/add", checkAuth, checkAuthAdmin,verifyURL, async (req, res, next) => {
	await Quiz.findById(req.body.quizId)
		.exec()
		.then(async (result1) => {
      if (!req.body.captcha) {
        return res.status(400).json({
          message: "No recaptcha token",
        });
      }
      var flag = 0;
      console.log(req.verifyURL)
      request(req.verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        console.log(err)
        console.log(body)
        try{
          if (!body.success || body.score < 0.4) {
            flag = 1
            return res.status(401).json({
              message: "Something went wrong",
            });
          }
          if(err){
            return res.status(401).json({
              message: err.toString(),
            });
          }
        }catch(err){
          return res.status(500).json({
            error: err
          })
        }
      });
      console.log(flag)
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
	verifyURL,
	async (req, res, next) => {
    if (!req.body.captcha) {
      return res.status(400).json({
        message: "No recaptcha token",
      });
    }
    var flag = 0;
    console.log(req.verifyURL)
    request(req.verifyURL, (err, response, body) => {
      body = JSON.parse(body);
      console.log(err)
      console.log(body)
      try{
        if (!body.success || body.score < 0.4) {
          flag = 1
          return res.status(401).json({
            message: "Something went wrong",
          });
        }
        if(err){
          return res.status(401).json({
            message: err.toString(),
          });
        }
      }catch(err){
        return res.status(500).json({
          error: err
        })
      }
    });
    console.log(flag)
		const updateOps = {};
		var flag = 0;
		for (const ops of req.body.updateOps) {
			updateOps[ops.propName] = ops.value;
		}
		await Question.updateOne(
			{ _id: req.params.questionId },
			{ $set: updateOps }
		)
			.exec()
			.then((result) => {
				res.status(200).json({
					message: "Question updated",
				});
			});
	}
);

router.post("/csv", checkAuth, checkAuthAdmin,verifyURL, async (req, res, next) => {
	if (!req.body.captcha) {
		return res.status(400).json({
			message: "No recaptcha token",
		});
  }
  var flag = 0;
  console.log(req.verifyURL)
	request(req.verifyURL, (err, response, body) => {
    body = JSON.parse(body);
    console.log(err)
    console.log(body)
    try{
      if (!body.success || body.score < 0.4) {
        flag = 1
        return res.status(401).json({
          message: "Something went wrong",
        });
      }
      if(err){
        return res.status(401).json({
          message: err.toString(),
        });
      }
    }catch(err){
      return res.status(500).json({
        error: err
      })
    }
  });
  console.log(flag)
	const { questions } = req.body;
	await Question.insertMany(questions)
		.then((result) => {
			res.status(200).json({
				message: "Success",
				result,
			});
		})
		.catch((err) => {
			res.status(400).json({
				message: "Error",
				error: err.toString(),
			});
		});
});

module.exports = router;
