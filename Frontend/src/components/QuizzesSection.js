import React, { useState, useEffect } from "react";
import './QuizzesSection.css';
import axios from "axios";
import QuizLoading from './QuizLoading';
import { GridList, GridListTile, GridListTileBar, Typography, Button, Dialog } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import TextInput from "./TextInput";

function QuizzesSection(props) {
	const [loading, setLoading] = useState(true);
	const [userType, setUserType] = useState(props.type);
	const [quizzes, setQuizzes] = useState([]);

	const [joinModal, setJoinModal] = useState(false);
	const [quizCode, setQuizCode] = useState("");
	const [quizCodeError, setQuizCodeError] = useState(false);

	const onCloseHandle = () => {
		setJoinModal(false);
		setQuizCode("");
		setQuizCodeError(false);
	}

	const onJoinClick = () => {
		setJoinModal(true);
	}

	const handleJoinChange = (event) => {
		setQuizCode(event.target.value);
	}

	const handleJoinSubmit = async () => {
		if(quizCode.trim().length === 0) {
			setQuizCodeError(true);
			return;
		}
		setQuizCodeError(false);
		let url = "https://quizzie-api.herokuapp.com/quiz/enrollPrivate";
		let token = localStorage.getItem("authToken");

		try {
			await axios.patch(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				console.log(res);
			})
		} catch(error) {
			console.log(error);
		}
	}

	const getQuizzes = async () => {
		let token = localStorage.getItem("authToken");
		let url = "https://quizzie-api.herokuapp.com/quiz/all";

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				let quizList = []
				res.data.result.map((quiz) => {
					if(quiz.quizType === "public")
						quizList.push(quiz);
				});

				setQuizzes(quizList);
				setLoading(false);
			})
		} catch(error) {
			console.log(error);
		}
	}


	useEffect(() => {
		getQuizzes();
	}, []);

	if(loading) {
		return (
			<QuizLoading />
		)
	} else {
		return (
			<div className="quizzes-section">
				<div className="quiz-btn-section">
					<Button className="join-quiz-btn" onClick={onJoinClick}><AddIcon />Join a Quiz</Button>
				</div>
				<Typography variant="h5" className="up-quizzes">Upcoming Quizzes</Typography>
				{quizzes.length === 0? <p>Sorry! No quizzes available at the moment!</p>
				: 
					<div className="quiz-list root">
						<GridList cols={3} className="grid-list">
							{quizzes.map((quiz) => (
								<GridListTile key={quiz._id} className="quiz-tile">
									<img src="../CC LOGO-01.svg" />
									<GridListTileBar 
										title={quiz.quizName} 
										subtitle={`By: ${quiz.adminId.name}`}
									/>
								</GridListTile>
							))}
						</GridList>
					</div> 
				}
				<Dialog open={joinModal} onClose={onCloseHandle} aria-labelledby="join-quiz-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '30%' } }}
					style={{ width: '100%' }}>
					<div className="modal-info">
						<Typography variant="h5" className="type-head">JOIN A PRIVATE QUIZ</Typography>
						<Typography variant="h6" className="type-head join-sub">Enter the code of the quiz you want to join</Typography>
						<TextInput 
							error={quizCodeError}
							helperText={quizCodeError? "Required": null}
							label="Quiz Code"
							variant="outlined"
							value={quizCode}
							onChange={handleJoinChange}
							className="quiz-code-field"/>
						<Button className="join-quiz-btn join-modal-btn" onClick={handleJoinSubmit}>Join!</Button>
					</div>
				</Dialog>
			</div>
		)
	}
}

export default QuizzesSection;