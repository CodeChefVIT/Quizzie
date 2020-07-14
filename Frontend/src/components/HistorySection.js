import React, { useState, useEffect } from "react";
import './HistorySection.css';
import { GridList, GridListTile, GridListTileBar, Tooltip, IconButton, isWidthUp, withWidth, List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { Check, Create, Settings, ArrowForwardIos } from "@material-ui/icons";
import axios from "axios";
import QuizLoading from "./QuizLoading";
import { Link } from "react-router-dom";

function HistorySection(props) {
	const [userType, setUserType] = useState(props.type);
	const [profile, setProfile] = useState(props.profile);
	const [quizzes, setQuizzes] = useState([]);

	const [loading, setLoading] = useState(true);

	const getCols = () => {
		if (isWidthUp('md', props.width)) {
			return 3;
		}

		return 2;
	}

	const getQuizzes = async () => {

		let token = localStorage.getItem("authToken");
		let url = null;

		if(userType === "admin") url = "https://quizzie-api.herokuapp.com/admin/created";
		else url = "https://quizzie-api.herokuapp.com/user/quizzesGiven";

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				let quizL = res.data.result.sort(function(a,b) {return a.scheduledFor - b.scheduledFor});
				setQuizzes(quizL);
				setLoading(false);
			})
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	useEffect(() => {
		getQuizzes();
	}, [])

	if (loading) {
		return (
			<QuizLoading />
		)
	}
	else if (userType === "admin") {
		return (
			<div className="history-section">
				{quizzes.length === 0 ?
					<p style={{ textAlign: 'center' }}>You have not created any quizzes yet!</p>
					:
					<GridList cols={getCols()} className="grid-list">
						{quizzes.map((quiz) => (
							<GridListTile key={quiz._id} className="quiz-tile">
								<img src="../CC LOGO-01.svg" />
								<GridListTileBar
									title={quiz.quizName}
									subtitle={`By: You`}
									actionIcon={
										<Tooltip title="Settings">
											<IconButton aria-label={`edit ${quiz.quizName}`}
												component={Link} to={`/editQuiz/${quiz._id}`}>
												<Settings className="enroll-icon" />
											</IconButton>
										</Tooltip>
									}
								/>
							</GridListTile>
						))}
					</GridList>
				}
			</div>
		)
	}
	else {
		return (
			<div className="history-section">
				{profile.quizzesGiven.length === 0 ?
					<p style={{ textAlign: 'center' }}>You have not given any quizzes yet!</p>
					: <List aria-label="quiz display" className="owner-quiz-list">
						{quizzes.map(quiz => (
							quiz.quizId !== null?
								(<ListItem button className="owner-quiz-item" component={Link} key={quiz._id} to={`/results/${quiz.quizId._id}`}>
									<ListItemText primary={quiz.quizId.quizName} secondary={`Scored: ${quiz.marks}`} />
									<ListItemSecondaryAction>
										<IconButton edge="end" aria-label="details" component={Link} to={`/results/${quiz.quizId._id}`}>
											<ArrowForwardIos />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>): null
						))}
					</List>}
			</div>
		)
	}
}

export default withWidth()(HistorySection);