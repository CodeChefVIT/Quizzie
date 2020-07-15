import React, {useState, useEffect} from "react";
import { Container, Button, Typography } from "@material-ui/core";
import TextInput from '../components/TextInput';
import './ForgotPassword.css';
import axios from "axios";
import Loading from "./Loading";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router";

function VerifyMail(props) {
	const [userType] = useState(props.match.params.type);
	const [email, setEmail] = useState("");

	const [code, setCode] = useState("");
	const [codeError, setCodeError] = useState("");
	const [codeChanged, setCodeChanged] = useState(false);

	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [redirectMain, setRedirectMain] = useState(false);

	const [error, setError] = useState(false);

	const handleCodeChange = (event) => {
		setCode(event.target.value);
	}

	const handleSubmit = async () => {
		setCodeChanged(true);

		let errors = false;

		if(code.length === 0) {
			setCodeError("Enter the verification code");
			errors = true;
		} 

		if(!errors && codeError.length === 0) {
			setLoading(true);
			let url = null;
			if(userType === "organizer") {
				url = `https://quizzie-api.herokuapp.com/admin/verifyEmail`;
			} else if(userType === "user") {
				url = `https://quizzie-api.herokuapp.com/user/verifyEmail`;
			}

			let data = {
				verificationKey: code,
			}

			try {
				await axios.patch(url, data).then(res => {
					setLoading(false);
					setRedirect(true);
				})
			} catch(error) {
				setLoading(false);
				if(error.response.status === 500) {
					setCodeError(true);
				}
				console.log(error);
			}
		}
	}

	useEffect(() => {
		if(props.match.params.type !== "user" && props.match.params.type !== "organizer") {
			setRedirectMain(true);
			return;
		}

		if(props.location.state === undefined) {
			setRedirectMain(true);
			return;
		} else {
			setEmail(props.location.state.email);
		}

		if(code.length === 0) setCodeError("This cannot be empty!");
		else setCodeError("");
	}, [code]);


	if(loading) return <Loading />
	else if(redirect) return <Redirect to={`/login/${userType}`} />
	else if(redirectMain) return <Redirect to="/" />
	else {
		return (
				<Container className="login-page">
					<div className="login-form">
						<Typography variant="h3" color="primary" className="login-head forgot-head">Verify E-mail</Typography><br />
						{!error? <Alert severity="info" color="info">A verification email was sent to {email}</Alert>: null}
						{error? <Alert severity="error" color="error">Verification mail could not be sent. Please try again...</Alert> : null}
						<form className="form">
							<TextInput
								error={codeChanged? (codeError.length === 0? false: true): false}
								helperText={codeChanged? (codeError.length === 0? null: codeError): null}
								id="verification-code"
								label="Verification Code"
								type="text"
								className="form-input"
								variant="outlined"
								value={code}
								onChange={handleCodeChange} />
						</form>
						<Button className="login-btn" onClick={handleSubmit}>Verify</Button>
					</div>
				</Container>
		)
	}
}

export default VerifyMail;