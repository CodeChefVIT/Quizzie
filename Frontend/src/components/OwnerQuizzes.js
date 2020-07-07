import React, {useState, useEffect} from "react";
import axios from "axios";
import './OwnerQuizzes.css';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ArrowForwardIos } from "@material-ui/icons";

function OwnerQuizzes(props) {
	const [quizzes, setQuizzes] = useState([]);

	const getAllQuizzes = async () => {
		let token = localStorage.getItem("authToken");
		let url = "https://quizzie-api.herokuapp.com/owner/allQuizzes";

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				console.log(res);
				setQuizzes(res.data.result);
			})
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getAllQuizzes();
	})

	return (
		<div className="owner-quizzes">
			<List aria-label="quiz display" className="owner-quiz-list">
			{quizzes.map(quiz => (
				<ListItem button className="owner-quiz-item" component={Link} to={`/ownerQuizDetails/${quiz._id}`} key={quiz._id}>
					<ListItemText primary={quiz.quizName} secondary={`By: ${quiz.adminId.name}`} />
					<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="details">
							<ArrowForwardIos />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			))}
			</List>
		</div>
	)
}

export default OwnerQuizzes;