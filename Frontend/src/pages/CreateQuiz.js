import React, { useState } from "react";
import './CreateQuiz.css';
import { Container, Typography, Grid, Slider, InputLabel, Select, MenuItem, Button } from "@material-ui/core";
import TextInput from "../components/TextInput";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function CreateQuiz() {
	const [quizName, setQuizName] = useState("");
	const [quizDate, setQuizDate] = useState(new Date());
	const [duration, setDuration] = useState(5);
	const [type, setType] = useState("private");

	const onQuizNameChange = (event) => {
		setQuizName(event.target.value);
	}

	const handleDateChange = (date) => {
		setQuizDate(date);
	}

	const handleTimeChange = (e, val) => {
		setDuration(val);
	}

	const onTypeChange = (event) => {
		setType(event.target.value);
	}

	return (
		<Container className="create-quiz-page">
			<div className="create-form">
				<Typography variant="h4" className="create-head">Quiz Details</Typography>
				<div className="create-form-inputs">
					<TextInput
						variant="outlined"
						label="Quiz Name"
						value={quizName}
						onChange={onQuizNameChange}
						name="Quiz Name" 
						className="form-input"/>
					
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid className="date-time-select" container spacing={3}>
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
					<p style={{marginTop: '5%', marginBottom: '5%'}}>Quiz Time (in minutes):</p>
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
						onChange={handleTimeChange}/>
					<p>Select quiz type: </p>
					<Select
						value={type}
						onChange={onTypeChange}
						className="type-select"
					>
						<MenuItem value="public">Public</MenuItem>
						<MenuItem value="private">Private</MenuItem>
					</Select>

					<Button className="login-btn create-btn">Create Quiz</Button>
				</div>
			</div>
		</Container>
	)
}

export default CreateQuiz;