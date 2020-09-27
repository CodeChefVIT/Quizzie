import React, { useState, useEffect, useContext, useRef } from "react";
import "./LoginPage.css";
import "./GoogleButton.css";
import {
	Container,
	Typography,
	Button,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Link, Redirect } from "react-router-dom";
import TextInput from "../components/TextInput";
import * as EmailValidator from "email-validator";
import InfoContext from "../context/InfoContext";
import axios from "axios";
import Loading from "./Loading";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function LoginPage(props) {
	const [email, changeEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);
	const [password, changePassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

	const [didLogin, setDidLogin] = useState(null);
	const [errorText, setErrorText] = useState(
		"Error Logging In! Try again...."
	);
	const [redirect, setRedirect] = useState(false);
	const [ownerRedirect, setOwnerRedirect] = useState(false);
	const [loginRedirect, setLoginRedirect] = useState(false);

	const [notVerified, setNotVerified] = useState(false);
	const [verifyMail, setVerifyMail] = useState("");

	const type = props.match.params.type;
	const type1 = type === "user" ? "user" : "organizer";

	const [isLoading, setLoading] = useState(false);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const { setLoggedIn, changeName, setAuthToken, setAdmin } = useContext(
		InfoContext
	);

	const mailErrorText = "Email cannot be empty";
	const passwordErrorText = "Password cannot be empty";

	const handleEmailChange = (event) => {
		setEmailChanged(true);
		changeEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPasswordChanged(true);
		changePassword(event.target.value);
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
		if (email.length === 0) setEmailError(mailErrorText);
		else setEmailError("");

		if (password.length === 0) setPasswordError(passwordErrorText);
		else setPasswordError("");
	}, [email, password]);

	const handleSubmit = async (event) => {
		// event.preventDefault();

		setEmailChanged(true);
		setPasswordChanged(true);

		let errors = false;

		if (email.length === 0) {
			setEmailError(mailErrorText);
			errors = true;
		} else if (!EmailValidator.validate(email)) {
			setEmailError("Invalid email address!");
			errors = true;
		}
		if (password.length === 0) {
			setPasswordError(passwordErrorText);
			errors = true;
		} else if (password.length < 8) {
			setPasswordError("Minimum length of password must be 8.");
			errors = true;
		}

		if (!errors && emailError.length === 0 && passwordError.length === 0) {
			setLoading(true);
			let lType = type;

			if (type === "organizer") lType = "admin";

			let url = `https://quizzie-api.herokuapp.com/${lType}/login`;
			let token = await executeRecaptcha("login_page");

			let data = {
				email: email,
				password: password,
				captcha: token,
			};

			let response = null;
			try {
				await axios.post(url, data).then((res) => {
					response = res;
				});

				if (response.status === 200) {
					changeName(response.data.userDetails.name);
					setLoggedIn(true);
					setAuthToken(response.data.token);

					localStorage.setItem("userLoggedIn", true);
					localStorage.setItem(
						"name",
						response.data.userDetails.name
					);
					localStorage.setItem("authToken", response.data.token);

					if (type === "owner") {
						setOwnerRedirect(true);
						//TODO: Redirect dashboard shit
					} else {
						setRedirect(true);
					}
				}
			} catch (error) {
				console.log(error);
				if (error.response.status === 409) {
					setVerifyMail(data.email);
					setNotVerified(true);
				} else if (error.response.status === 401) {
					setErrorText("Invalid Credentials...");
					setDidLogin(false);
				} else {
					setErrorText("Error Logging In! Try again....");
					setDidLogin(false);
				}
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (type !== "user" && type !== "organizer" && type !== "owner") {
			setRedirect(true);
		}
	}, [type]);

	if (redirect === true) {
		return <Redirect to="/" />;
	} else if (ownerRedirect) {
		return <Redirect to="/coronilOP" />;
	}
	return isLoading ? (
		<Loading />
	) : (
		<Container className="login-page">
			<div className="login-form">
				<Typography variant="h3" color="primary" className="login-head">
					{type === "user"
						? "Login Now"
						: type === "organizer"
						? "Organizer Login"
						: "Owner Login"}
				</Typography>
				<br />
				{didLogin === false ? (
					<Alert severity="error">{errorText}</Alert>
				) : null}
				{notVerified ? (
					<Alert severity="error">
						Your email is not verified.
						<Link
							className="link"
							style={{ color: "red" }}
							to={{
								pathname: `/verify/${type}`,
								state: {
									email: verifyMail,
									sendCode: true,
								},
							}}
						>
							Click here to verify...
						</Link>
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
								<b>Sign in with Google</b>
							</p>
						</div>
					</a>
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
					<br />
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
				</form>
				<div className="forgot-section">
					{type === "owner" ? null : (
						<Link
							to={`/forgotPassword/${type}`}
							className="link forgot-pass"
						>
							Forgot your password?
						</Link>
					)}
				</div>
				<Button className="login-btn" onClick={handleSubmit}>
					Login
				</Button>
				<Link to={`/register/${type}`} className="link register-link">
					Don't have an account? Join the Quizzie now!
				</Link>
			</div>
		</Container>
	);
}

export default LoginPage;
