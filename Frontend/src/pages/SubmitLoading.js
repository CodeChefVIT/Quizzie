import React from "react";
import {CircularProgress} from "@material-ui/core";
import './Loading.css';

function SubmitLoading() {
	return (
		<div className="loading-screen">
			<CircularProgress color="secondary" />
			<div class="loader">Submitting your answers
				<span class="loader__dot">.</span>
				<span class="loader__dot">.</span>
				<span class="loader__dot">.</span></div>
		</div>
	);
}

export default SubmitLoading;