// Copy of UpdateProfile.js
import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { Container, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router-dom";
import TextInput from "../components/TextInput";
import axios from "axios";
import Loading from "./Loading";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function UpdateProfile(props) {
	const [oldPass, setOldPass] = useState("");
	const [oldPassError, setOldPassError] = useState(false);

	const [newPass, setNewPass] = useState("");
	const [newPassError, setNewPassError] = useState(false);

	const [confirmPass, setConfirmPass] = useState("");
	const [confirmPassError, setConfirmPassError] = useState(false);
	const [confirmPassErrorText, setConfirmPassErrorText] = useState("");

	const [loading, setLoading] = useState(false);
	const [type, setType] = useState(props.match.params.type);

	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState(
		"There was some problem! Please try again..."
	);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const handleOldPassChange = (event) => {
		setOldPass(event.target.value);
	};
	const handleNewPassChange = (event) => {
		setNewPass(event.target.value);
	};
	const handleConfirmPassChange = (event) => {
		setConfirmPass(event.target.value);
	};

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};

	const validate = () => {
		let errors = false;

		if (oldPass.trim().length === 0) {
			setOldPassError(true);
			errors = true;
		} else setOldPassError(false);

		if (newPass.trim().length === 0) {
			setNewPassError(true);
			errors = true;
		} else setNewPassError(false);

		if (confirmPass.trim().length === 0) {
			setConfirmPassError(true);
			setConfirmPassErrorText("This cannot be empty");
			errors = true;
		} else if (confirmPass !== newPass) {
			setConfirmPassErrorText("Does not match password");
			setConfirmPassError(true);
			errors = true;
		} else setConfirmPassError(false);

		return !errors;
	};

	const handleSubmit = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/${type}/changePassword`;

		if (token === null) {
			setRedirect(true);
			return;
		}

		if (!validate()) return;

		setLoading(true);
		let captcha = await executeRecaptcha("update_password");

		let data = {
			password: oldPass,
			newPassword: newPass,
			captcha: captcha,
		};

		try {
			await axios
				.patch(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setRedirect(true);
				});
		} catch (error) {
			console.log(error);
			if (error.response.status === 401) {
				setErrorText("Old password is wrong!");
			} else {
				setErrorText("There was some problem! Please try again...");
			}
			setError(true);
			setLoading(false);
		}
	};

	useEffect(() => {
		let token = localStorage.getItem("authToken");
		if (token === null) {
			setRedirect(true);
			return;
		}
	}, []);

	if (redirect) {
		return <Redirect to="/dashboard" />;
	}
	return loading ? (
		<Loading />
	) : (
		<Container className="login-page">
			<div className="login-form">
				<Typography variant="h3" color="primary" className="login-head">
					Update Profile
				</Typography>
				<br />
				{error === true ? (
					<Alert severity="error">{errorText}</Alert>
				) : null}
				<form className="form">
					<TextInput
						error={oldPassError}
						helperText={
							oldPassError ? "This cannot be empty" : null
						}
						id="old-pass"
						label="Old Password"
						type="password"
						className="form-input"
						variant="outlined"
						value={oldPass}
						onChange={handleOldPassChange}
					></TextInput>
					<TextInput
						error={newPassError}
						helperText={
							newPassError ? "This cannot be empty" : null
						}
						id="new-pass"
						label="New Password"
						type="password"
						className="form-input"
						variant="outlined"
						value={newPass}
						onChange={handleNewPassChange}
					></TextInput>
					<br />
					<TextInput
						error={confirmPassError}
						helperText={
							confirmPassError ? confirmPassErrorText : null
						}
						id="confirm-pass"
						type="password"
						label="Confirm Password"
						className="form-input"
						variant="outlined"
						value={confirmPass}
						onChange={handleConfirmPassChange}
						onKeyPress={keyPress}
					></TextInput>
				</form>
				<Button className="login-btn" onClick={handleSubmit}>
					Update
				</Button>
			</div>
		</Container>
	);
}

export default UpdateProfile;
