import React from "react";
import "./ResultPage.css";
import { Container, Typography } from "@material-ui/core";

function ResultPage(props) {
	return (
		<Container className="result-page">
			<div className="result-head">
				<Typography variant="h4" className="result-title">Results</Typography>
			</div>
		</Container>
	)
}

export default ResultPage;