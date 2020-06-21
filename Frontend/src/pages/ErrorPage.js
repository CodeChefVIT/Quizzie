import React from "react";
import { Redirect } from "react-router-dom";
import { Typography, Container } from "@material-ui/core";

import './ErrorPage.css';

function ErrorPage() {
	return (
		<Redirect to="/" />
		// <div className="error-section">
		// 	<Container>
		// 		<Typography variant="h2" className="error-msg">Oops! Looks like there are no districts with this URL!</Typography>
		// 	</Container>
		// </div>
	)
}

export default ErrorPage;