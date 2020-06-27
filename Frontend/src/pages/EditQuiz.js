import React, { useEffect, useState } from "react";
import './EditQuiz.css';
import { Container, Typography, Button } from "@material-ui/core";
import { Create } from "@material-ui/icons";
import axios from "axios";
import Loading from "./Loading";

function EditQuiz(props) {
	const quizId = props.match.params.id;

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const [quizDetails, setQuizDetails] = useState({});
	const [quizQuestions, setQuizQuestions] = useState([]);

	const getQuizDetails = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/${quizId}`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then((res) => {
				setQuizDetails(res.data.result);
			})
		} catch(error) {
			console.log(error);

		}

		url = `https://quizzie-api.herokuapp.com/question/all/${quizId}`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				setQuizQuestions(res.data.result);
				setLoading(false);
			})
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getQuizDetails();
	}, [])

	if(loading) {
		return (
			<Loading />
		)
	}
	else {
		return (
			<Container className="edit-quiz-page">
				<Typography variant="h3" className="dash-head p-top edit-quiz-head">Edit Quiz</Typography>
				<div className="edit-btn-bar">
					<Button variant="filled" className="edit-details-btn">
						<Create className="edit-icon"/>Edit Details
					</Button>
				</div>
				<div className="quiz-details-sec">
					<Typography variant="h6" className="quiz-detail-param">Name: <span className="quiz-detail-text">{quizDetails.quizName}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Date: <span className="quiz-detail-text">{new Date(quizDetails.quizDate).toDateString()}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Time: <span className="quiz-detail-text">{new Date(quizDetails.quizDate).toLocaleTimeString()}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Type: <span className="quiz-detail-text">{quizDetails.quizType}</span></Typography>
				</div>
				<div className="quiz-questions-sec">
					<Typography variant="h4" className="quiz-questions-head">Questions</Typography>
					<div className="quiz-questions-display">
						<div className="add-question-bar">
							<Button variant="filled" className="add-question-btn">Add a question</Button>
						</div>
						{quizQuestions.length === 0? <p style={{ textAlign: 'center' }}>No questions added yet!</p>
						: null}
					</div>
				</div>
			</Container>
		)
	}
}

export default EditQuiz;