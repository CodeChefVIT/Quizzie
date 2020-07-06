/* Copy of EditQuiz.js */
import React, { useEffect, useState } from "react";
import './EditQuiz.css';
import {
	Container, Typography, Button, Dialog, Grid, InputLabel, Select, MenuItem,
	ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List,
	ListItem, ListItemText, ListItemIcon, FormControlLabel, IconButton, DialogTitle
} from "@material-ui/core";
import { Create, ExpandMore, Adjust, Delete } from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import TextInput from "../components/TextInput";

function OwnerQuizDetails(props) {
	const quizId = props.match.params.id;

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const [quizDetails, setQuizDetails] = useState({});
	const [quizQuestions, setQuizQuestions] = useState([]);
	
	const [deleteModal, setDeleteModal] = useState(false);

	const handleDeleteBtn = () => {
		setDeleteModal(true);
	}

	const handleDelete = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/delete`;

		let data = {
			"quizId": quizId
		}

		console.log(data);

		try {
			await axios.delete(url, {
				headers: {
					"auth-token": token
				},
				data: data
			}).then(res => {
				console.log(res);
				setRedirect(true);
			})
		} catch (error) {
			console.log(error);
		}
	}

	const getQuizDetails = async () => {
		setLoading(true);
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
		} catch (error) {
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
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		let token = localStorage.getItem("authToken");
		if (token === null) {
			setLoading(false);
			setRedirect(true);
			return;
		}
		getQuizDetails();
	}, [])

	if (loading) {
		return (
			<Loading />
		)
	} else if (redirect) {
		return (
			<Redirect to="/coronilOP" />
		)
	}
	else {
		return (
			<Container className="edit-quiz-page">
				<Typography variant="h3" className="dash-head p-top edit-quiz-head">Quiz Details</Typography>
				<div className="edit-btn-bar">
					<Button className="edit-details-btn delete-btn">
						<Delete className="edit-icon" onClick={handleDeleteBtn}/>Delete Quiz
					</Button>
				</div>
				<div className="quiz-details-sec">
					<Typography variant="h6" className="quiz-detail-param">Name: <span className="quiz-detail-text">{quizDetails.quizName}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Date: <span className="quiz-detail-text">{new Date(Number(quizDetails.scheduledFor)).toDateString()}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Time: <span className="quiz-detail-text">{new Date(Number(quizDetails.scheduledFor)).toLocaleTimeString()}</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Duration: <span className="quiz-detail-text">{quizDetails.quizDuration} minutes</span></Typography>
					<Typography variant="h6" className="quiz-detail-param">Type: <span className="quiz-detail-text">{quizDetails.quizType}</span></Typography>
					{quizDetails.quizType === "private" ?
						<Typography variant="h6" className="quiz-detail-param">Quiz Code: <span className="quiz-detail-text">{quizDetails.quizCode}</span></Typography>
						: null}
				</div>
				<div className="quiz-questions-sec">
					<Typography variant="h4" className="quiz-questions-head">Questions</Typography>
					<div className="quiz-questions-display">
						{quizQuestions.length === 0 ? <p style={{ textAlign: 'center' }}>No questions added yet!</p>
							:
							<div className="questions-list-display">
								{quizQuestions.map((question) => (
									<ExpansionPanel elevation={3} className="expansion" key={question._id}>
										<ExpansionPanelSummary
											className="question-summary"
											expandIcon={<ExpandMore />}
											aria-controls="question-content"
											aria-label="Expand"
										>
											<Typography className="question-label">{question.description}</Typography> 
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
											<List component="nav" className="options-display">
												{question.options.map((option) => (
													<ListItem button key={option._id}>
														<ListItemIcon><Adjust style={{ color: question.correctAnswer === option.text ? 'green' : 'black' }} /></ListItemIcon>
														<ListItemText style={{ color: question.correctAnswer === option.text ? 'green' : 'black' }} primary={option.text} />
													</ListItem>
												))}
											</List>
										</ExpansionPanelDetails>
									</ExpansionPanel>
								))}
							</div>
						}
					</div>
				</div>
				<Dialog open={deleteModal} onClose={() => setDeleteModal(false)} aria-labelledby="delete-quiz-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: 'black', minWidth: '10%' } }}>
					<DialogTitle>Are you sure you want to delete this quiz?</DialogTitle>
					<div className="btn-div">
						<Button className="logout-btn m-right bg-red-btn" onClick={handleDelete}>Yes</Button>
						<Button className="cancel-btn m-left" onClick={() => setDeleteModal(false)}>No</Button>
					</div>
				</Dialog>
			</Container>
		)
	}
}

export default OwnerQuizDetails;