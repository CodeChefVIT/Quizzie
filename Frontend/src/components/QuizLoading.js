import React from "react";
import {CircularProgress} from "@material-ui/core";
import '../pages/Loading.css';

function QuizLoading() {
	return (
		<div className="loading-screen">
			<CircularProgress color="primary" />
			<div class="loader">Loading Quizzes
				<span class="loader__dot">.</span>
				<span class="loader__dot">.</span>
				<span class="loader__dot">.</span></div>
		</div>
	);
}

export default QuizLoading;