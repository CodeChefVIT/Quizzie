import React, { useState, useEffect } from "react";
import './QuizzesSection.css';
import axios from "axios";
import QuizLoading from './QuizLoading';
import { GridList, GridListTile, GridListTileBar, Typography, Button, Dialog, 
		isWidthUp, withWidth, IconButton, Tooltip, Snackbar } from "@material-ui/core";
import { Add, Check } from '@material-ui/icons';
import TextInput from "./TextInput";
import { Alert } from "@material-ui/lab";
import { Link } from "react-router-dom";

function QuizzesSection(props) {
	const [loading, setLoading] = useState(true);
	const [userType, setUserType] = useState(props.type);
	const [quizzes, setQuizzes] = useState([]);

	const [joinModal, setJoinModal] = useState(false);
	const [quizCode, setQuizCode] = useState("");
	const [quizCodeError, setQuizCodeError] = useState(false);

	const [enrollModal, setEnrollModal] = useState(false);
	const [enrollQuizName, setEnrollQuiz] = useState("");
	const [enrollQuizId, setEnrollQuizId] = useState("");
	const [snackbar, setSnackBar] = useState(false);
	const [errorSnack, setErrorSnack] = useState(false);

	const getCols = () => {
		if (isWidthUp('md', props.width)) {
			return 3;
		}

		return 2;
	}

	const onCloseHandle = () => {
		setJoinModal(false);
		setQuizCode("");
		setQuizCodeError(false);
		setEnrollModal(false);
		setEnrollQuiz("");
		setEnrollQuizId("");
		getQuizzes();
	}

	const onJoinClick = () => {
		setJoinModal(true);
	}

	const handleJoinChange = (event) => {
		setQuizCode(event.target.value);
	}

	const handleEnrollButton = (quiz) => {
		setEnrollQuiz(quiz.quizName);
		setEnrollQuizId(quiz._id);
		setEnrollModal(true);
	}

	const handleJoinSubmit = async () => {
		if (quizCode.trim().length === 0) {
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
		} catch (error) {
			console.log(error);
		}
	}

	const handleEnroll = async () => {
		let token = localStorage.getItem("authToken");
		let url = "https://quizzie-api.herokuapp.com/quiz/enroll";

		let data = {
			"quizId": enrollQuizId,
		}

		try {
			await axios.patch(url, data, {
				headers: {
					"auth-token": token,
				}
			}).then((res) => {
				onCloseHandle();
				setSnackBar(true);
			})
		}catch(error) {
			console.log(error);
			setErrorSnack(true);
		}
	}

	const getQuizzes = async () => {
		setLoading(true);
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
					if (quiz.quizType === "public")
						quizList.push(quiz);
				});

				setQuizzes(quizList);
				setLoading(false);
			})
		} catch (error) {
			console.log(error);
		}
	}


	useEffect(() => {
		getQuizzes();
	}, []);

	if (loading) {
		return (
			<QuizLoading />
		)
	} else {
		return (
			<div className="quizzes-section">
				<div className="quiz-btn-section">
					<Button className="join-quiz-btn" onClick={onJoinClick}><Check />Join a Quiz</Button>
					{userType === "admin" ?
					<Button className="create-quiz-btn" component={Link} to="/createQuiz">
						<Add />Create a quiz
					</Button> : null}
				</div>
				<Typography variant="h5" className="up-quizzes">Upcoming Quizzes</Typography>
				{quizzes.length === 0 ? <p>Sorry! No quizzes available at the moment!</p>
					:
					<div className="quiz-list root1">
						<GridList cols={getCols()} className="grid-list">
							{quizzes.map((quiz) => (
								<GridListTile key={quiz._id} className="quiz-tile">
									<img src="../CC LOGO-01.svg" />
									<GridListTileBar
										title={quiz.quizName}
										subtitle={`By: ${quiz.adminId.name}`}
										actionIcon={
											<Tooltip title="Enroll">
												<IconButton aria-label={`enroll ${quiz.quizName}`} onClick={() => handleEnrollButton(quiz)}>
													<Check className="enroll-icon" />
												</IconButton>
											</Tooltip>
										}
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
							helperText={quizCodeError ? "Required" : null}
							label="Quiz Code"
							variant="outlined"
							value={quizCode}
							onChange={handleJoinChange}
							className="quiz-code-field" />
						<Button className="join-quiz-btn join-modal-btn" onClick={handleJoinSubmit}>Join!</Button>
					</div>
				</Dialog>
				<Dialog open={enrollModal} onClose={onCloseHandle} aria-labelledby="enroll-quiz-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '30%' } }}
					style={{ width: '100%' }}>
					<div className="modal-info">
						{userType === "admin" ? <Typography variant="h6" className="type-head join-sub">Organizers cannot enroll in quizzes.</Typography> :
							<div>
								<Typography variant="h6" className="type-head join-sub">{`Are you sure you want to join ${enrollQuizName}?`}</Typography>
								<div className="btn-div m-top">
									{/* classes in Navbar.css */}
									<Button className="logout-btn m-right" onClick={handleEnroll}>Yes</Button>
									<Button className="cancel-btn m-left" onClick={onCloseHandle}>No</Button>
								</div>
							</div>
						}
					</div>
				</Dialog>
				<Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackBar(false)}>
					<Alert variant="filled" severity="success" onClose={() => setSnackBar(false)}>Successfully Enrolled!</Alert>
				</Snackbar>
				<Snackbar open={errorSnack} autoHideDuration={3000} onClose={() => setErrorSnack(false)}>
					<Alert variant="filled" severity="error" onClose={() => setErrorSnack(false)}>There was some error. Please try again!</Alert>
				</Snackbar>
			</div>
		)
	}
}

export default withWidth()(QuizzesSection);