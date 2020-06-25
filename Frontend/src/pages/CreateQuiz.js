import React, { useState } from "react";
import './CreateQuiz.css';
import { Container, Typography, Grid } from "@material-ui/core";
import TextInput from "../components/TextInput";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function CreateQuiz() {
	const [quizName, setQuizName] = useState("");
	const [quizDate, setQuizDate] = useState(new Date());

	const onQuizNameChange = (event) => {
		setQuizName(event.target.value);
	}

	const handleDateChange = (date) => {
		setQuizDate(date);
		console.log(date);
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
						<Grid className="date-time-select" container spacing={2}>
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
							<Grid item xs={12} md={6}>
								<KeyboardTimePicker
									margin="normal"
									label="Select Quiz Start Time"
									value={quizDate}
									onChange={handleDateChange}
								/>
							</Grid>
						</Grid>
					</MuiPickersUtilsProvider>
				</div>
			</div>
		</Container>
	)
}

export default CreateQuiz;