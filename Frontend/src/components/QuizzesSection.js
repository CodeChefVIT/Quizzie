import React, { useState, useEffect } from "react";
import './QuizzesSection.css';
import axios from "axios";

function QuizzesSection() {
	const [quizzes, setQuizzes] = useState([]);

	const getQuizzes = async () => {
		let token = localStorage.getItem("authToken");
		let url = "https://quizzie-api.herokuapp.com/quiz/all";

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				setQuizzes(res.data.result);
			})
		} catch(error) {
			console.log(error);
		}
	}


	useEffect(() => {
		getQuizzes();
	});

	return (
		<div className="quizzes-section">
			{quizzes.length === 0? <p>Sorry! No quizzes available at the moment!</p>
			:null }
		</div>
	)
}

export default QuizzesSection;