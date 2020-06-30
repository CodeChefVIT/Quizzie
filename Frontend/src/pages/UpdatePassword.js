// Copy of UpdateProfile.js
import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { Container, Typography, Button } from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Redirect} from "react-router-dom";
import TextInput from "../components/TextInput";
import axios from "axios";
import Loading from "./Loading";


function UpdateProfile(props) {
	const [oldPass, setOldPass] = useState("");
	const [newPass, setNewPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");

	const [loading, setLoading] = useState(false);
	const [type, setType] = useState(props.match.params.type);

	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(false);

	const handleOldPassChange = (event) => {
		setOldPass(event.target.value);
	}
	const handleNewPassChange = (event) => {
		setNewPass(event.target.value);
	}
	const handleConfirmPassChange = (event) => {
		setConfirmPass(event.target.value);
	}

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	}

	const handleSubmit = async () => {
		// setLoading(true);
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/${type}/updateProfile`;
	}

	if(redirect) {
		return (
			<Redirect to="/dashboard" />
		)
	} 
	return (
		loading? <Loading />
		:
		<Container className="login-page">
			<div className="login-form">
				<Typography variant="h3" color="primary" className="login-head">Update Profile</Typography><br />
				{error === true? <Alert severity="error">There was some error! Please try again...</Alert>: null}
				<form className="form">
					<TextInput
						// error={}
						// helperText={nameError? "Name cannot be empty": null}
						id="old-pass"
						label="Old Password"
						type="password"
						className="form-input"
						variant="outlined"
						value={oldPass}
						onChange={handleOldPassChange}></TextInput>
					<TextInput
						// error={nameError}
						// helperText={nameError? "Name cannot be empty": null}
						id="new-pass"
						label="New Password"
						type="password"
						className="form-input"
						variant="outlined"
						value={newPass}
						onChange={handleNewPassChange}></TextInput>
					<br />
					<TextInput
						// error={numberError}
						// helperText={numberError? "Invalid Phone Number": null}
						id="confirm-pass"
						type="password"
						label="Confirm Password"
						className="form-input"
						variant="outlined"
						value={confirmPass}
						onChange={handleConfirmPassChange}
						onKeyPress={keyPress}></TextInput>
				</form>
				<Button className="login-btn" onClick={handleSubmit}>Update</Button>
			</div>
		</Container>
	)
}

export default UpdateProfile;