/* Copy of createQuiz page */
import React, { useState, useEffect } from "react";
import "./CreateQuiz.css";
import {
	Container,
	Typography,
	Grid,
	Slider,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Tooltip,
} from "@material-ui/core";
import TextInput from "../components/TextInput";
import {
	KeyboardDatePicker,
	KeyboardTimePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { Redirect } from "react-router";
import Loading from "../pages/Loading";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function UpdateQuizDetails(props) {
	const [quizId, setQuizId] = useState(props.match.params.id);
	const [quizName, setQuizName] = useState("");
	const [quizDate, setQuizDate] = useState(new Date());
	const [duration, setDuration] = useState(5);
	const [type, setType] = useState("private");

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const onQuizNameChange = (event) => {
		setQuizName(event.target.value);
	};

	const handleDateChange = (date) => {
		setQuizDate(date);
	};

	const handleTimeChange = (e, val) => {
		setDuration(val);
	};

	const onTypeChange = (event) => {
		setType(event.target.value);
	};

	const handleSubmit = async () => {
		setLoading(true);
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/updateDetails/${quizId}`;

		let captcha = await executeRecaptcha("update_quiz_details");

		let updateOps = [
			{ propName: "quizName", value: quizName },
			{ propName: "scheduledFor", value: quizDate.getTime() },
			{ propName: "quizDuration", value: duration },
		];

		let data = {
			updateOps,
			captcha,
		};

		try {
			await axios
				.patch(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setLoading(false);
					setRedirect(true);
				});
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const getQuizDetails = async () => {
		setLoading(true);
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/${quizId}`;

		try {
			await axios
				.get(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					let details = res.data.result;
					setQuizName(details.quizName);
					setQuizDate(new Date(Number(details.scheduledFor)));
					setDuration(details.quizDuration);
					setType(details.quizType);
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		getQuizDetails();
	}, []);

	useEffect(() => {
		let token = localStorage.getItem("authToken");
		if (token === null) {
			setLoading(false);
			setRedirect(true);
			return;
		}
	}, []);

	if (loading) {
		return <Loading />;
	} else if (redirect) {
		return <Redirect to={`/editQuiz/${quizId}`} />;
	} else {
		return (
			<Container className="create-quiz-page">
				<div className="create-form">
					<Typography variant="h4" className="create-head">
						Quiz Details
					</Typography>
					<div className="create-form-inputs">
						<TextInput
							variant="outlined"
							label="Quiz Name"
							value={quizName}
							onChange={onQuizNameChange}
							name="Quiz Name"
							className="form-input"
						/>

						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid
								className="date-time-select"
								container
								spacing={3}
							>
								<Grid item xs={12} sm={6}>
									<KeyboardDatePicker
										disableToolbar
										variant="inline"
										format="MM/dd/yyyy"
										margin="normal"
										label="Select Quiz Date"
										value={quizDate}
										onChange={handleDateChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<KeyboardTimePicker
										margin="normal"
										label="Select Quiz Start Time"
										value={quizDate}
										onChange={handleDateChange}
									/>
								</Grid>
							</Grid>
						</MuiPickersUtilsProvider>
						<p style={{ marginTop: "5%", marginBottom: "5%" }}>
							Quiz Time (in minutes):
						</p>
						<Slider
							defaultValue={5}
							aria-labelledby="quiz time slider"
							step={5}
							min={5}
							max={60}
							valueLabelDisplay="on"
							marks
							className="time-slider"
							value={duration}
							onChange={handleTimeChange}
						/>
						<p style={{ color: "#777" }}>Select quiz type: </p>
						<Tooltip title="Cannot change quiz type">
							<Select
								disabled
								value={type}
								onChange={onTypeChange}
								className="type-select"
							>
								<MenuItem value="public">Public</MenuItem>
								<MenuItem value="private">Private</MenuItem>
							</Select>
						</Tooltip>

						<Button
							className="login-btn create-btn"
							onClick={handleSubmit}
						>
							Update Quiz
						</Button>
					</div>
				</div>
			</Container>
		);
	}
}

export default UpdateQuizDetails;
