const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

////routers

const app = express();

const userRoutes = require("./api/routers/user");
const adminRoutes = require("./api/routers/admin");


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

// Allow CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		);
		return res.status(200).json({});
	}
	next();
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
