const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const passportSetup = require("./Backend/api/config/passport-setup");
const passportSetupAdmin = require("./Backend/api/config/passport-setup-admin");
const passport = require("passport");
const cors = require("cors");
const cookieSession = require("cookie-session");
const ipfilter = require('express-ipfilter').IpFilter
const rateLimit = require("express-rate-limit");
const schedule = require('node-schedule');
const sgMail = require("@sendgrid/mail");
const emailTemplates = require("./Backend/emails/email");

sgMail.setApiKey(process.env.SendgridAPIKey);

////routers

const app = express();

const userRoutes = require("./Backend/api/routers/user");
const adminRoutes = require("./Backend/api/routers/admin");
const quizRoutes = require("./Backend/api/routers/quiz");
const questionRoutes = require("./Backend/api/routers/questions");
const authRoutes = require("./Backend/api/routers/auth");
const authAdminRoutes = require("./Backend/api/routers/auth-admin");
const generalRoutes = require("./Backend/api/routers/general");
const ownerRoutes = require("./Backend/api/routers/owner");


//IMPORT QUIZ AND USERS

const Quiz = require('./Backend/api/models/quiz');
const User = require('./Backend/api/models/user');
const Admin = require('./Backend/api/models/admin');


const dbURI = process.env.dbURI;

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Database Connected"))
	.catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(Date.now())
// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.cookieSession]
// }));

// const ips = ['172.67.176.16','104.24.123.191','104.24.122.191','10.41.141.207','10.63.249.212','10.69.232.242','108.162.194.81','162.159.38.81','172.64.34.81','172.64.33.140','173.245.59.140','108.162.193.140','162.243.166.170','157.245.130.6']
// // // Create the server
// app.use(ipfilter(ips, { mode: 'allow' }))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

/////Rate Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 150, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Allow CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization,auth-token"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

app.use(cors());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/quiz", quizRoutes);
app.use("/question", questionRoutes);
app.use("/auth", authRoutes);
app.use("/general", generalRoutes);
app.use("/owner", ownerRoutes);
app.use("/auth/admin", authAdminRoutes);

app.get('/', async (req, res) => {
  res.send('hi')
})

//route not found
app.use((req, res, next) => {
	const error = new Error("Route not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

////SEND REMINDER EMAIL 
var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 5);

schedule.scheduleJob(rule, async function(){
  let currentTime = Date.now();
  const quizzes = await Quiz.find({
    reminderSent: {$ne: true},
    scheduledFor: {
      $lte: currentTime + 30*60*1000,
    }
  })
  console.log(`${quizzes.length} number of quizzes need to be reminded`);

  for(let i = 0; i < quizzes.length; i++){
    console.log(quizzes[i])
    for(j = 0; j < quizzes[i].usersEnrolled.length; j++){
      console.log(quizzes[i].usersEnrolled[j])
      const user = await User.findById(quizzes[i].usersEnrolled[j].userId)
      const msg = {
        to: user.email,
        from: process.env.sendgridEmail,
        subject: "Quzzie: Quiz Reminder",
        text: `This is an automatically genrated email sent from Quizzie. This is to remind you that your quiz ${quizzes[i].quizName} is scheduled at ${new Date(Number(quizzes[i].scheduledFor))}, Please login on time to not miss out on your quiz.`,
      };
    
      sgMail
        .send(msg)
        .then((result) => {
          console.log(`Reminder email for ${quizzes[i].quizName} to ${msg.to}`)
        })
        .catch((err) => {
          console.log('Some Error Occured', err.toString())
        });
    }  
    await Quiz.updateOne({ _id: quizzes[i]._id }, { reminderSent: true })
  }
  // console.log(quizzes)
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
