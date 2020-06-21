import React, { useState, useEffect } from 'react';
import './RegisterPage.css';
import { Container, Typography, Button } from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Redirect} from "react-router-dom";
import TextInput from "../components/TextInput";
import * as EmailValidator from "email-validator";
import axios from 'axios';
import Loading from "./Loading";

function RegisterPage() {
	const [name, changeName] = useState("");
	const [nameError, setNameError] = useState("");
	const [nameChanged, setNameChanged] = useState(false);

	const [regNo, setRegNo] = useState("");
	const [regError, setRegError] = useState("");
	const [regChanged, setRegChanged] = useState(false);

	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneNumberError, setPhoneNumberError] = useState("");
	const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);

	const [email, changeEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailChanged, setEmailChanged] = useState(false);

	const [password, changePassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passwordChanged, setPasswordChanged] = useState(false);

	const [redirect, setRedirect] = useState(false);

	const [signedUp, setSignedUp] = useState(false);
	const [existEmail, setExistEmail] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const emptyText = (type) =>  `${type} cannot be empty`;

	const handleNameChange = (event) => {
		setNameChanged(true);
		changeName(event.target.value);
	}
	
	const handleRegChange = (event) => {
		setRegChanged(true);
		setRegNo(event.target.value);
	}
	
	const handlePhoneChange = (event) => {
		setPhoneNumberChanged(true);
		setPhoneNumber(event.target.value);
	}

	const handleEmailChange = (event) => {
		setEmailChanged(true);
		changeEmail(event.target.value);
	}

	const handlePasswordChange = (event) => {
		setPasswordChanged(true);
		changePassword(event.target.value);
	}

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	}

	useEffect(() => {
		if(name.length === 0) setNameError(emptyText("Name"));
		else setNameError("");

		if(email.length === 0) setEmailError(emptyText("Email"));
		else setEmailError("");

		if(password.length === 0) setPasswordError(emptyText("Password"));
		else setPasswordError("");
		
		if(regNo.length === 0) setRegError(emptyText("Registration Number"));
		else setRegError("");
		
		if(phoneNumber.length === 0) setPhoneNumberError(emptyText("Phone Number"));
		else setPhoneNumberError("");

	}, [name, email, password, regNo, phoneNumber]);

	const handleSubmit = async (event) => {
		// event.preventDefault();
		setNameChanged(true);
		setPasswordChanged(true);
		setEmailChanged(true);
		setRegChanged(true);
		setPhoneNumberChanged(true);

		let errors = false;

		if(name === "") {
			setEmailError(emptyText("Name"));
			errors = true;
		}

		if(email === "") {
			setEmailError(emptyText("Email"));
			errors = true;
		} else if(!EmailValidator.validate(email)) {
			setEmailError("Invalid email address!");
			errors = true;
		}
		if(password === "") {
			setPasswordError(emptyText("Password"));
			errors = true;
		} else if(password.length < 8) {
			setPasswordError("Minimum length of password must be 8.");
			errors = true;
		}

		if(regNo === "") {
			setRegError(emptyText("Registration Number"));
			errors = true;
		}

		if(phoneNumber === "") {
			setPhoneNumberError(emptyText("Phone Number"));
			errors = true;
		} else if(phoneNumber.length !== 10) {
			setPhoneNumberError("Invalid phone number");
			errors = true;
		}

		if(!errors && emailError.length === 0 && passwordError.length === 0) {
			setLoading(true);
			let url = `https://scholastic-quiz-app.herokuapp.com/api/user/register`;
			
			let data = {
				name: name,
				email: email,
				password: password,
				registrationNumber: regNo.trim().toUpperCase(),
				phoneNumber: phoneNumber,
			}

			let response = null;
			try {
				await axios.post(url, data).then(res => {
					response = res;
				});

				if(response.status === 200) {
					setSignedUp(true);
					setRedirect(true);
				} 
			} catch(error) {
				if(error.response.status === 401) {
					setError(true);
					setErrorText("Email already exists");
				} else if(error.response.status === 402) {
					setError(true);
					setErrorText("Registration number already exists!");
				} 
				else {
					console.log(error);
					setPasswordChanged(false);
				}
				changePassword("");
				setPasswordChanged(false);
			}	
		}
		setLoading(false);
	}
	if(redirect === true){
		return <Redirect to='/login' />
	}
	return (
		isLoading? <Loading />
		:
		<Container className="login-page">
			<div className="login-form">
				<img src="hg-pin.png" className="signup-img" alt="Mokingjay Pin"></img>
				<Typography variant="h3" color="primary" className="login-head signup-text">Join the force!</Typography><br />
				{signedUp === true? <Alert severity="success" color="warning">Succesfully Signed Up! Redirecting...</Alert>: null}
				{error === true? <Alert severity="warning" color="warning">{errorText}</Alert>: null}
				<form className="form">
					<TextInput
						error={nameChanged? (nameError.length === 0? false: true): false}
						helperText={nameChanged? (nameError.length === 0? null: nameError): null}
						id="name"
						label="Name"
						type="text"
						className="form-input"
						variant="outlined"
						value={name}
						onChange={handleNameChange}
						onKeyPress={keyPress}></TextInput>
					<TextInput
						error={regChanged? (regError.length === 0? false: true): false}
						helperText={regChanged? (regError.length === 0? null: regError): null}
						id="reg-no"
						label="Registration Number (NA for externals)"
						type="text"
						className="form-input"
						variant="outlined"
						value={regNo}
						onChange={handleRegChange}
						onKeyPress={keyPress}></TextInput>
					<TextInput
						error={phoneNumberChanged? (phoneNumberError.length === 0? false: true): false}
						helperText={phoneNumberChanged? (phoneNumberError.length === 0? null: phoneNumberError): null}
						id="phone-number"
						label="Phone Number"
						type="text"
						className="form-input"
						variant="outlined"
						value={phoneNumber}
						onChange={handlePhoneChange}
						onKeyPress={keyPress}></TextInput>
					<TextInput
						error={emailChanged? (emailError.length === 0? false: true): false}
						helperText={emailChanged? (emailError.length === 0? null: emailError): null}
						id="email"
						label="Email"
						type="email"
						className="form-input"
						variant="outlined"
						value={email}
						onChange={handleEmailChange}
						onKeyPress={keyPress}></TextInput>
					<br />
					<TextInput
						error={passwordChanged? (passwordError.length === 0? false: true): false}
						helperText={passwordChanged? (passwordError.length === 0? null: passwordError): null}
						id="password"
						type="password"
						label="Password"
						className="form-input"
						variant="outlined"
						value={password}
						onChange={handlePasswordChange}
						onKeyPress={keyPress}></TextInput>
				</form>
				<Button className="login-btn" onClick={handleSubmit}>Sign Up</Button>
			</div>
		</Container>
	)
}

export default RegisterPage;