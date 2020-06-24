import React, { useState, useEffect } from "react";
import './QuizzesSection.css';
import axios from "axios";
import QuizLoading from './QuizLoading';
import { GridList, GridListTile, GridListTileBar, Typography, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

function QuizzesSection(props) {
	const [loading, setLoading] = useState(true);
	const [userType, setUserType] = useState(props.type);
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
					<Button className="join-quiz-btn"><AddIcon />Join a Quiz</Button>
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
			</div>
		)
	}
}

export default QuizzesSection;