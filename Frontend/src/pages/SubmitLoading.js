import React from "react";
import {CircularProgress} from "@material-ui/core";
import './Loading.css';

function SubmitLoading() {
	return (
		<div className="loading-screen">
			<CircularProgress color="secondary" />
			<div className="loader">Submitting your answers
				<span className="loader__dot">.</span>
				<span className="loader__dot">.</span>
				<span className="loader__dot">.</span></div>
		</div>
	);
}

export default SubmitLoading;