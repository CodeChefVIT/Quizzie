import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@material-ui/core";
import TextInput from "../components/TextInput";
import EmailValidator from "email-validator";
import "./ForgotPassword.css";
import axios from "axios";
import Loading from "./Loading";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function ForgotPassword(props) {
	const [userType] = useState(props.match.params.type);

	const [email, changeEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);

	const [password, changePassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);
	const [confirmPassword, setConfirmedPassword] = useState("");
	const [confirmPasswordError, setConfirmedPasswordError] = useState("");

	const [reset, setReset] = useState(true);
	const [resetCode, setResetCode] = useState("");
	const [resetCodeError, setResetCodeError] = useState("");
	const [resetCodeChanged, setResetCodeChanged] = useState(false);

	const [tokenSent, setTokenSent] = useState(false);
	const [invalidKey, setInvalidKey] = useState(false);
	const [expiredKey, setExpiredKey] = useState(false);
	const [notSent, setNotSent] = useState(false);
	const [passwordConfirmed, setPasswordConfirmed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [loginRedirect, setLoginRedirect] = useState(false);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const handleEmailChange = (event) => {
		setEmailChanged(true);
		changeEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPasswordChanged(true);
		changePassword(event.target.value);
	};

	const handleConfirmPasswordChange = (event) => {
		setConfirmedPassword(event.target.value);
	};

	const handleResetCodeChange = (event) => {
		setResetCodeChanged(true);
		setResetCode(event.target.value);
	};

	const keyPress = (event) => {
		if (event.key === "Enter") {
			if (tokenSent) {
				handleSubmit();
			} else {
				handleReset();
			}
		}
	};

	const mailErrorText = "Email cannot be empty!";
	const resetCodeErrorText = "Enter the reset code.";
	const passwordErrorText = "Password cannot be empty!";
	const confirmPasswordErrorText = "Does not match the password!";

	const handleReset = async (event) => {
		// event.preventDefault();

		setEmailChanged(true);

		let errors = false;

		if (email.length === 0) {
			setEmailError(mailErrorText);
			errors = true;
		} else if (!EmailValidator.validate(email)) {
			setEmailError("Invalid email address!");
			errors = true;
		}

		if (!errors && emailError.length === 0) {
			setLoading(true);
			let captcha = await executeRecaptcha("forgot_pass");

			let url = null;
			if (userType === "organizer") {
				url = `https://quizzie-api.herokuapp.com/admin/forgot`;
			} else if (userType === "user") {
				url = `https://quizzie-api.herokuapp.com/user/forgot`;
			}

			let data = {
				email: email,
				captcha: captcha,
			};

			try {
				await axios.post(url, data).then((res) => {
					setTokenSent(true);
				});
			} catch (error) {
				if (error.response.status === 400) {
					setNotSent(true);
				}
				console.log(error);
			}
		}
		setLoading(false);
	};

	const handleSubmit = async (event) => {
		// event.preventDefault();

		let errors = false;

		if (confirmPassword !== password) {
			errors = true;
			setConfirmedPasswordError(confirmPasswordErrorText);
		}

		if (!errors) {
			setLoading(true);
			let url = null;

			if (userType === "organizer") {
				url = `https://quizzie-api.herokuapp.com/admin/resetpass`;
			} else if (userType === "user") {
				url = `https://quizzie-api.herokuapp.com/user/resetpass`;
			}
			let captcha = await executeRecaptcha("reset_pass");

			let data = {
				resetKey: resetCode,
				newPassword: password,
				captcha: captcha,
			};

			let response = null;
			try {
				await axios.post(url, data).then((res) => {
					setReset(false);
					setPasswordConfirmed(true);
				});
			} catch (error) {
				setReset(false);
				if (error.response.status === 400) {
					setInvalidKey(true);
				} else if (error.response.status === 401) {
					setExpiredKey(true);
				}
				console.log(error);
			}

			changePassword("");
			setConfirmedPassword("");
			setResetCode("");
			setPasswordChanged(false);
			setResetCodeChanged(false);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (
			props.match.params.type !== "user" &&
			props.match.params.type !== "organizer"
		) {
			setRedirect(true);
			return;
		}
		if (email.length === 0) setEmailError(mailErrorText);
		else setEmailError("");

		if (password.length === 0) setPasswordError(passwordErrorText);
		else setPasswordError("");

		if (resetCode.length === 0) setResetCodeError(resetCodeErrorText);
		else setResetCodeError("");
	}, [email, password, resetCode]);

	useEffect(() => {
		if (passwordConfirmed) {
			setTimeout(() => {
				setLoginRedirect(true);
			}, 1500);
		}
	}, [passwordConfirmed]);

	if (loading) return <Loading />;
	else if (redirect) return <Redirect to="/" />;
	else if (loginRedirect) return <Redirect to={`/login/${userType}`} />;
	else if (!tokenSent) {
		return (
			<Container className="login-page">
				<div className="login-form">
					<Typography
						variant="h3"
						color="primary"
						className="login-head forgot-head"
					>
						Forgot Password
					</Typography>
					<br />
					{notSent ? (
						<Alert severity="error" color="warning">
							We couldn't find a user with that e-mail address.
						</Alert>
					) : null}
					<form className="form">
						<TextInput
							error={
								emailChanged
									? emailError.length === 0
										? false
										: true
									: false
							}
							helperText={
								emailChanged
									? emailError.length === 0
										? null
										: emailError
									: null
							}
							id="email"
							label="Email"
							type="email"
							className="form-input"
							variant="outlined"
							value={email}
							onChange={handleEmailChange}
							onKeyPress={keyPress}
						></TextInput>
					</form>
					<Button className="login-btn" onClick={handleReset}>
						Send mail
					</Button>
				</div>
			</Container>
		);
	} else if (tokenSent) {
		return (
			<Container className="login-page">
				<div className="login-form">
					<Typography
						variant="h3"
						color="primary"
						className="login-head forgot-head"
					>
						Forgot Password
					</Typography>
					<br />
					{reset ? (
						<Alert severity="info">Reset code sent!</Alert>
					) : null}
					{invalidKey ? (
						<Alert severity="error" color="warning">
							Invalid reset Code
						</Alert>
					) : null}
					{expiredKey ? (
						<Alert severity="error" color="warning">
							Reset Code expired!
						</Alert>
					) : null}
					{passwordConfirmed ? (
						<Alert severity="success" color="warning">
							Password reset successful! Redirecting...
						</Alert>
					) : null}
					<form className="form">
						<TextInput
							error={
								resetCodeChanged
									? resetCodeError.length === 0
										? false
										: true
									: false
							}
							helperText={
								resetCodeChanged
									? resetCodeError.length === 0
										? null
										: resetCodeError
									: null
							}
							id="reset-code"
							label="Reset Code"
							type="text"
							className="form-input"
							variant="outlined"
							value={resetCode}
							onChange={handleResetCodeChange}
							onKeyPress={keyPress}
						></TextInput>
						<TextInput
							error={
								passwordChanged
									? passwordError.length === 0
										? false
										: true
									: false
							}
							helperText={
								passwordChanged
									? passwordError.length === 0
										? null
										: passwordError
									: null
							}
							id="password"
							label="New Password"
							type="password"
							className="form-input"
							variant="outlined"
							value={password}
							onChange={handlePasswordChange}
							onKeyPress={keyPress}
						></TextInput>
						<TextInput
							error={
								confirmPasswordError.length === 0 ? false : true
							}
							helperText={confirmPasswordError}
							id="confirm-password"
							label="Confirm Password"
							type="password"
							className="form-input"
							variant="outlined"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							onKeyPress={keyPress}
						></TextInput>
					</form>
					<Button className="login-btn" onClick={handleSubmit}>
						Reset Password
					</Button>
				</div>
			</Container>
		);
	}
}

export default ForgotPassword;
