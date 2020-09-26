import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import {
	Container,
	Typography,
	Button,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Redirect, Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import * as EmailValidator from "email-validator";
import axios from "axios";
import Loading from "./Loading";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function RegisterPage(props) {
	const [name, changeName] = useState("");
	const [nameError, setNameError] = useState("");
	const [nameChanged, setNameChanged] = useState(false);

	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneNumberError, setPhoneNumberError] = useState("");
	const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);

	const [boardPosition, setBoardPosition] = useState("");
	const [boardPositionError, setBoardPositionError] = useState("");
	const [boardPositionChanged, setBoardPositionChanged] = useState(false);

	const [email, changeEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);

	const [password, changePassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [code, setCode] = useState("");
	const [codeError, setCodeError] = useState("");
	const [codeChanged, setCodeChanged] = useState(false);

	const [redirect, setRedirect] = useState(false);
	const [redirectMain, setRedirectMain] = useState(false);

	const [signedUp, setSignedUp] = useState(false);
	const [existEmail, setExistEmail] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const type = props.match.params.type;
	const { executeRecaptcha } = useGoogleReCaptcha();

	const emptyText = (type) => `${type} cannot be empty`;

	const handleNameChange = (event) => {
		setNameChanged(true);
		changeName(event.target.value);
	};

	const handlePhoneChange = (event) => {
		setPhoneNumberChanged(true);
		setPhoneNumber(event.target.value);
	};

	const handleBoardPositionChange = (event) => {
		setBoardPositionChanged(true);
		setBoardPosition(event.target.value);
	};

	const handleEmailChange = (event) => {
		setEmailChanged(true);
		changeEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPasswordChanged(true);
		changePassword(event.target.value);
	};

	const handleCodeChange = (event) => {
		setCodeChanged(true);
		setCode(event.target.value);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};

	useEffect(() => {
		if (name.length === 0) setNameError(emptyText("Name"));
		else setNameError("");

		if (email.length === 0) setEmailError(emptyText("Email"));
		else setEmailError("");

		if (password.length === 0) setPasswordError(emptyText("Password"));
		else setPasswordError("");

		if (phoneNumber.length === 0)
			setPhoneNumberError(emptyText("Phone Number"));
		else setPhoneNumberError("");

		if (type === "owner") {
			if (boardPosition.length === 0)
				setBoardPositionError(emptyText("Board Position"));
			else setBoardPositionError("");

			if (code.length === 0) setCodeError(emptyText("Secret Code"));
			else setCodeError("");
		}
	}, [name, email, password, phoneNumber, boardPosition, code]);

	const handleSubmit = async (event) => {
		// event.preventDefault();
		setNameChanged(true);
		setPasswordChanged(true);
		setEmailChanged(true);
		setPhoneNumberChanged(true);

		if (type === "owner") {
			setBoardPositionChanged(true);
			setCodeChanged(true);
		}

		let errors = false;

		if (name.trim().length === 0) {
			setEmailError(emptyText("Name"));
			errors = true;
		}

		if (email.trim().length === 0) {
			setEmailError(emptyText("Email"));
			errors = true;
		} else if (!EmailValidator.validate(email)) {
			setEmailError("Invalid email address!");
			errors = true;
		}
		if (password.trim().length === 0) {
			setPasswordError(emptyText("Password"));
			errors = true;
		} else if (password.length < 8) {
			setPasswordError("Minimum length of password must be 8.");
			errors = true;
		}

		if (type === "owner") {
			if (boardPosition.trim().length === 0) {
				setBoardPositionError(emptyText("Board Position"));
				errors = true;
			}

			if (code.trim().length === 0) {
				setCodeError(emptyText("Secret Code"));
				errors = true;
			}
		}

		if (phoneNumber.trim().length === 0) {
			setPhoneNumberError(emptyText("Phone Number"));
			errors = true;
		} else if (phoneNumber.length !== 10) {
			setPhoneNumberError("Invalid phone number");
			errors = true;
		}

		if (!errors && emailError.length === 0 && passwordError.length === 0) {
			setLoading(true);
			let sType = type;

			if (type === "organizer") sType = "admin";

			let url = `https://quizzie-api.herokuapp.com/${sType}/signup`;

			let data = null;

			let token = await executeRecaptcha("signup_page");
			console.log(token);

			if (type === "owner") {
				data = {
					name: name,
					email: email,
					password: password,
					mobileNumber: phoneNumber,
					boardPosition: boardPosition,
					signupCode: code,
					captcha: token,
				};
			} else {
				data = {
					name: name,
					email: email,
					password: password,
					mobileNumber: phoneNumber,
					captcha: token,
				};
			}

			let response = null;
			try {
				await axios.post(url, data).then((res) => {
					response = res;
				});

				if (response.status === 201) {
					setSignedUp(true);
					setRedirect(true);
				}
			} catch (error) {
				if (error.response.status === 409) {
					setErrorText("Account already exists...");
				} else if (type === "owner" && error.response.status === 400) {
					setErrorText("Wrong secret code...");
				} else {
					setErrorText("There was some error!");
				}
				setPasswordChanged(false);
				changePassword("");
				setError(true);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (type !== "user" && type !== "organizer" && type !== "owner") {
			setRedirectMain(true);
		}
	}, [type]);

	if (redirect === true) {
		let to =
			type === "user"
				? "user"
				: type === "organizer"
				? "organizer"
				: "owner";
		return (
			<Redirect
				to={{
					pathname: `/verify/${to}`,
					state: {
						email: email,
					},
				}}
			/>
		);
	} else if (redirectMain) {
		return <Redirect to="/" />;
	}
	return isLoading ? (
		<Loading />
	) : (
		<Container className="login-page">
			<div className="login-form">
				<Typography
					variant="h3"
					color="primary"
					className="login-head signup-text"
				>
					{type === "user"
						? "Join the force!"
						: type === "organizer"
						? "Organizer Sign Up"
						: "Owner Signup"}
				</Typography>
				<br />
				{signedUp === true ? (
					<Alert severity="success" color="warning">
						Succesfully Signed Up! Redirecting...
					</Alert>
				) : null}
				{error === true ? (
					<Alert severity="error" color="error">
						{errorText}
					</Alert>
				) : null}
				{type !== "owner" ? (
					<a
						href={
							type === "user"
								? "https://quizzie-api.herokuapp.com/auth/google"
								: "https://quizzie-api.herokuapp.com/auth/admin/google"
						}
						className="google-link"
					>
						<div className="google-btn">
							<div className="google-icon-wrapper">
								<img
									className="google-icon"
									src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
								/>
							</div>
							<p className="btn-text">
								<b>Sign up with Google</b>
							</p>
						</div>
					</a>
				) : null}
				<form className="form">
					<TextInput
						error={
							nameChanged
								? nameError.length === 0
									? false
									: true
								: false
						}
						helperText={
							nameChanged
								? nameError.length === 0
									? null
									: nameError
								: null
						}
						id="name"
						label="Name"
						type="text"
						className="form-input"
						variant="outlined"
						value={name}
						onChange={handleNameChange}
						onKeyPress={keyPress}
					></TextInput>
					<TextInput
						error={
							phoneNumberChanged
								? phoneNumberError.length === 0
									? false
									: true
								: false
						}
						helperText={
							phoneNumberChanged
								? phoneNumberError.length === 0
									? null
									: phoneNumberError
								: null
						}
						id="phone-number"
						label="Phone Number"
						type="text"
						className="form-input"
						variant="outlined"
						value={phoneNumber}
						onChange={handlePhoneChange}
						onKeyPress={keyPress}
					></TextInput>
					{type === "owner" ? (
						<TextInput
							error={
								boardPositionChanged
									? boardPositionError.length === 0
										? false
										: true
									: false
							}
							helperText={
								boardPositionChanged
									? boardPositionError.length === 0
										? null
										: boardPositionError
									: null
							}
							id="board-position"
							label="Board Position"
							type="text"
							className="form-input"
							variant="outlined"
							value={boardPosition}
							onChange={handleBoardPositionChange}
							onKeyPress={keyPress}
						></TextInput>
					) : null}
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
						type={showPassword ? "text" : "password"}
						label="Password"
						className="form-input"
						variant="outlined"
						value={password}
						onChange={handlePasswordChange}
						onKeyPress={keyPress}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="show password"
										onClick={togglePasswordVisibility}
										edge="end"
									>
										{showPassword ? (
											<Visibility />
										) : (
											<VisibilityOff />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					></TextInput>
					{type === "owner" ? (
						<TextInput
							error={
								codeChanged
									? codeError.length === 0
										? false
										: true
									: false
							}
							helperText={
								codeChanged
									? codeError.length === 0
										? null
										: codeError
									: null
							}
							id="owner-code"
							label="Secret Code"
							type="text"
							className="form-input"
							variant="outlined"
							value={code}
							onChange={handleCodeChange}
							onKeyPress={keyPress}
						></TextInput>
					) : null}
				</form>
				<Button className="login-btn signup-btn" onClick={handleSubmit}>
					Sign Up
				</Button>
				{/* <Link to="/registerOrganiser" className="link register-link">Are you an Organiser? Go to the organiser signup!</Link> */}
			</div>
		</Container>
	);
}

export default RegisterPage;
