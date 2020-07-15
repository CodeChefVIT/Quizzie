const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
//const sharp = require('sharp');
const Admin = require("../models/admin");
const Quiz = require("../models/quiz");
const User = require("../models/user");

const checkAuth = require("../middleware/checkAuth");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const checkAuthUser = require("../middleware/checkAuthUser");

const router = express.Router();

sgMail.setApiKey(process.env.SendgridAPIKey);

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


router.get('/allStudentsQuizResult/:quizId',checkAuth,checkAuthAdmin,async(req,res,next)=>{
	const users = await Quiz.findById(req.params.quizId).populate({
        path: "usersParticipated",
        populate: { path: "userId", select: { name: 1 } },
      })
	if(!users){
		res.status(400).json({
			message:"Some error occurred"
		})
	}
	const userResults = users.usersParticipated
	res.status(200).json({
		userResults
	})
})

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



router.post("/forgot", (req, res) => {
	var email = req.body.email;
	Admin.findOne({ email: email }, (err, userData) => {
	  if (!err && userData != null) {
		userData.passResetKey = shortid.generate();
		userData.passKeyExpires = new Date().getTime() + 20 * 60 * 1000; // pass reset key only valid for 20 minutes
		userData.save().then((x) => {
		  if (!err) {
			// let transporter = nodemailer.createTransport({
			//   service: "gmail",
			//   port: 465,
			//   auth: {
			//     user: process.env.sendgridEmail,
			//     pass: "",
			//   },
			// });
			const msg = {
			  to: email,
			  from: process.env.sendgridEmail,
			  subject: "Kaloory: Password Reset Request",
			  text: " ",
			  html: `
			  <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title> </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    .ReadMsgBody {
      width: 100%;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass * {
      line-height: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if !mso]><!-->
  <style type="text/css">
    @media only screen and (max-width:480px) {
      @-ms-viewport {
        width: 320px;
      }
      @viewport {
        width: 320px;
      }
    }
  </style>
  <!--<![endif]-->
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-66 {
        width: 66.66666666666666% !important;
        max-width: 66.66666666666666%;
      }
      .mj-column-per-33 {
        width: 33.33333333333333% !important;
        max-width: 33.33333333333333%;
      }
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.full-width-mobile {
        width: 100% !important;
      }
      td.full-width-mobile {
        width: auto !important;
      }
    }
  </style>
</head>

<body style="background-color:white;">
  <div style="background-color:white;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      <tbody>
        <tr>
          <td>
            <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="Margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                      <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:middle;width:399.99999999999994px;"
            >
          <![endif]-->
                      <div class="mj-column-per-66 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0px;word-break:break-word;">
                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:center;color:#000000;"> <span style="font-size: 30px; color: #4390B1;"><b>Quizzie</b></span> </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#2980b9;background-color:#2980b9;width:100%;">
      <tbody>
        <tr>
          <td>
            <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="Margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                      <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:middle;width:199.99999999999997px;"
            >
          <![endif]-->
                      <div class="mj-column-per-33 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                <tbody>
                                  <tr>
                                    <td style="width:149px;"> <img alt="CodeChef VIT" height="auto" src="https://codechefvit.com/assets/images/logos/ccwhite.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;" width="149" /> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:middle;width:399.99999999999994px;"
            >
          <![endif]-->
                      <div class="mj-column-per-66 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20;padding-bottom:0px;word-break:break-word;">
                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1;text-align:center;color:#000000;"> <span style="font-size: 25px"><a href="http://www.codechefvit.com/contact.html" style="text-decoration: none; color: white;">Password Reset Code</a></span> </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="Margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#DCF0F9;background-color:#DCF0F9;Margin:0px auto;border-radius:30px;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#DCF0F9;background-color:#DCF0F9;width:100%;border-radius:30px;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:middle;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;"> <span style="font-weight: bold; font-size: 21px; color: #45474e">
            
          </span><br /><br /><br /> <span style="font-weight: bold; font-size: 15px; color: grey">Hey ${userData.name}!<br/><br/>
							Lost your password? Don't worry, it happens to the best of us :)
Use the code below and start enjoying Quizzie again by generating a new password.
							<br>
							<br>
							<br>
							<p
							style="line-height: 1.5; text-align: center; word-break: break-word; font-family: 'Source Sans Pro', Tahoma, Verdana, Segoe, sans-serif; font-size: 14px; mso-line-height-alt: 21px; margin: 0;">
							<span
								style="font-size: 14px; background: #EEEEEE; font-weight:200;font-size:1.5rem;padding:5px 10px; text-align: center">
								${userData.passResetKey}
								</em></span></p>
								<br>
								<br>
								<br>

								Please do not share this code with anyone, valid for the next 20 minutes.
					</span> </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="Margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#2980b9;background-color:#2980b9;width:100%;">
      <tbody>
        <tr>
          <td>
            <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
            <div style="Margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                  <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                      <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                      <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                              <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;line-height:1;text-align:center;color:white;">Made with ❤️ by CodeChef-VIT</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
      >
        <tr>
      
              <td>
            <![endif]-->
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                <tr>
                                  <td style="padding:4px;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3b5998;border-radius:3px;width:20px;">
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;"> <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/codechefvit" target="_blank">
                    <img
                       height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;" width="20"
                    />
                  </a> </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                <tr>
                                  <td style="padding:4px;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3f729b;border-radius:3px;width:20px;">
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;"> <a href="https://www.instagram.com/codechefvit" target="_blank">
                    <img
                       height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png" style="border-radius:3px;" width="20"
                    />
                  </a> </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                <tr>
                                  <td style="padding:4px;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#0077b5;border-radius:3px;width:20px;">
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;"> <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://www.linkedin.com/company/codechef-vit/about&title=&summary=&source=" target="_blank">
                    <img
                       height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png" style="border-radius:3px;" width="20"
                    />
                  </a> </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                <tr>
                                  <td style="padding:4px;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#000000;border-radius:3px;width:20px;">
                                      <tr>
                                        <td style="font-size:0;height:20px;vertical-align:middle;width:20px;"> <a href="https://github.com/CodeChefVIT" target="_blank">
                    <img
                       height="20" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/github.png" style="border-radius:3px;" width="20"
                    />
                  </a> </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso | IE]>
              </td>
            
          </tr>
        </table>
      <![endif]-->
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>

</html>
			 
			  `,
			};
  
			sgMail
			  .send(msg)
			  .then((result) => {
				res.status(200).json({
				  message: "Password reset key sent to email",
				});
			  })
			  .catch((err) => {
				console.log(err.toString());
				res.status(500).json({
				  // message: "something went wrong1",
				  error: err,
				});
			  });
  
		  }
		});
	  } else {
		res.status(400).send("email is incorrect");
	  }
	});
  });
  
  router.post("/resetpass", async (req, res) => {
	let resetKey = req.body.resetKey;
	let newPassword = req.body.newPassword;
	
	await Admin.findOne({passResetKey:resetKey})
	.then(async(result)=>{
		if(Date.now()>result.passKeyExpires){
			res.status(401).json({
				message:"Pass key expired"
			})
		}
		result.password = bcrypt.hashSync(newPassword,10)
		result.passResetKey = null
		result.passKeyExpires = null
		await result.save().then((result1)=>{
			res.status(200).json({
				message:"Password updated"
			})
		}).catch((err)=>{
			res.status(400).json({
				message:"Unusual error",
				err:err.toString()
			})

		})
	})
	.catch((err)=>{
		res.status(400).json({
			message:"Invalid pass key"
		})
	})
});

module.exports = router;
