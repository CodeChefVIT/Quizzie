import React, { useState, useEffect, useContext } from 'react';
import './LoginPage.css';
import { Container, Typography, Button, InputAdornment, IconButton } from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Link, Redirect} from "react-router-dom";
import TextInput from "../components/TextInput";
import * as EmailValidator from 'email-validator';
import InfoContext from '../context/InfoContext';
import axios from "axios";
import Loading from "./Loading";
import { Visibility, VisibilityOff } from '@material-ui/icons';


function UpdateProfile(props) {
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const handleNameChange = (event) => {
		setName(event.target.value);
	}

	const handlePhoneNumberChange = (event) => {
		setPhoneNumber(event.target.value);
	}
	

	const keyPress = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	}

	if(redirect === true){
		return <Redirect to='/' />
	}
	return (
		isLoading? <Loading />
		:
		<Container className="login-page">
			<div className="login-form">
				<Typography variant="h3" color="primary" className="login-head">Update Profile</Typography><br />
				{didLogin === false? <Alert severity="error">{errorText}</Alert>: null}
				<form className="form">
					<TextInput
						// error={emailChanged? (emailError.length === 0? false: true): false}
						// helperText={emailChanged? (emailError.length === 0? null: emailError): null}
						id="name"
						label="Name"
						type="text"
						className="form-input"
						variant="outlined"
						value={name}
						onChange={handleNameChange}
						onKeyPress={keyPress}></TextInput>
					<br />
					<TextInput
						// error={passwordChanged? (passwordError.length === 0? false: true): false}
						// helperText={passwordChanged? (passwordError.length === 0? null: passwordError): null}
						id="phone-number"
						type="text"
						label="Phone Number"
						className="form-input"
						variant="outlined"
						value={phoneNumber}
						onChange={handlePhoneNumberChange}
						onKeyPress={keyPress}></TextInput>
				</form>
				<Button className="login-btn" onClick={handleSubmit}>Update</Button>
			</div>
		</Container>
	)
}

export default UpdateProfile;