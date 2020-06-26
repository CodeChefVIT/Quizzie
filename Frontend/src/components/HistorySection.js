import React, { useState, useEffect } from "react";
import './HistorySection.css';
import { GridList, GridListTile, GridListTileBar, Tooltip, IconButton, isWidthUp, withWidth } from "@material-ui/core";
import { Check, Create } from "@material-ui/icons";
import axios from "axios";
import QuizLoading from "./QuizLoading";

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
		let url = "https://quizzie-api.herokuapp.com/admin/created";

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				console.log(res);
				setQuizzes(res.result);
				setLoading(false);
			})
		} catch(error) {
			console.log(error);
			setLoading(false);
		}
	}

	useEffect(() => {
		getQuizzes();
	}, [])

	if(loading) {
		return (
			<QuizLoading />
		)
	}
	else if(userType === "admin") {
		return (
			<div className="history-section">
				{profile.quizzes.length === 0? 
					<p>You have not created any quizzes yet!</p>
				:
				<GridList cols={getCols()} className="grid-list">
				{profile.quizzes.map((quiz) => (
					<GridListTile key={quiz._id} className="quiz-tile">
						<img src="../CC LOGO-01.svg" />
						<GridListTileBar
							title={quiz.quizId.quizName}
							subtitle={`By: You`}
							actionIcon={
								<Tooltip title="Edit">
									<IconButton aria-label={`edit ${quiz.quizId.quizName}`}>
										<Create className="enroll-icon" />
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
				{profile.quizzesGiven.length === 0? 
					<p>You have not given any quizzes yet!</p>
				: null}
			</div>
		)
	}
}

export default withWidth()(HistorySection);