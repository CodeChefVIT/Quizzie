import React from "react";
import { Redirect } from "react-router-dom";
import { Typography, Container } from "@material-ui/core";

import './ErrorPage.css';

function ErrorPage() {
	return (
		<div className="error-section">
			<Container>
				<Typography variant="h2" className="error-msg">Oops! Looks like there is nothing on this URL!</Typography>
			</Container>
		</div>
	)
}

export default ErrorPage;