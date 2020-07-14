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

function EditQuiz(props) {
	const quizId = props.match.params.id;

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const [quizDetails, setQuizDetails] = useState({});
	const [quizQuestions, setQuizQuestions] = useState([]);

	const [questionModal, setQuestionModal] = useState(false);
	const [newQuestion, setNewQuestion] = useState("");
	const [newQuestionError, setNewQuestionError] = useState(false);

	const [option1, setOption1] = useState("");
	const [option1Error, setOption1Error] = useState(false);
	const [option2, setOption2] = useState("");
	const [option2Error, setOption2Error] = useState(false);
	const [option3, setOption3] = useState("");
	const [option3Error, setOption3Error] = useState(false);
	const [option4, setOption4] = useState("");
	const [option4Error, setOption4Error] = useState(false);
	const [correctOption, setCorrectOption] = useState(-1);
	const [correctOptionError, setCorrectOptionError] = useState(false);

	const [update, setUpdate] = useState(false);
	const [updateId, setUpdateId] = useState(null);

	const [deleteModal, setDeleteModal] = useState(false);
	const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);

	const [responses, setResponses] = useState([]);
	const [currResponse, setCurrResponse] = useState(null);
	const [responseRedir, setResponseRedir] = useState(false);

	const onCloseHandle = () => {
		setQuestionModal(false);
		if (update) {
			setUpdate(false);
			setUpdateId(null);
			clearModal();
		}
	}

	const onQuestionChange = (event) => {
		setNewQuestion(event.target.value);
	}

	const handleOptionChange1 = (event) => {
		setOption1(event.target.value);
	}
	const handleOptionChange2 = (event) => {
		setOption2(event.target.value);
	}
	const handleOptionChange3 = (event) => {
		setOption3(event.target.value);
	}
	const handleOptionChange4 = (event) => {
		setOption4(event.target.value);
	}

	const handleCorrectOption = (event) => {
		setCorrectOption(event.target.value);
	}

	const clearModal = () => {
		setNewQuestion("");
		setNewQuestionError(false);
		setOption1("");
		setOption1Error(false);
		setOption2("");
		setOption2Error(false);
		setOption3("");
		setOption3Error(false);
		setOption4("");
		setOption4Error(false);
		setCorrectOption(-1);
		setCorrectOptionError(false);
	}

	const handleQuestionEditBtn = (question) => {
		setUpdate(true);
		setUpdateId(question._id);
		setNewQuestion(question.description);
		setOption1(question.options[0].text);
		setOption2(question.options[1].text);
		setOption3(question.options[2].text);
		setOption4(question.options[3].text);
		setCorrectOption(question.correctAnswer);
		setQuestionModal(true);
	}

	const handleQuestionDeleteBtn = (question) => {
		setUpdateId(question._id);
		setDeleteQuestionModal(true);
	}

	const handleQuestionModalClose = () => {
		setUpdateId(null);
		setDeleteQuestionModal(false);
	}

	const handleDeleteBtn = () => {
		setDeleteModal(true);
	}

	const studentResonse = (response) => {
		setCurrResponse(response);
		setResponseRedir(true);
	}

	const handleDeleteQuestion = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/${updateId}`;

		try {
			await axios.delete(url, {
				headers: {
					"auth-token": token
				}
			}).then((res) => {
				setUpdateId(null);
				setDeleteQuestionModal(false);
				getQuizDetails();
			})
		} catch(error) {
			console.log(error);
		}

	}

	const handleDelete = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/delete`;

		let data = {
			"quizId": quizId
		}

		try {
			await axios.delete(url, {
				headers: {
					"auth-token": token
				},
				data: data
			}).then(res => {
				setRedirect(true);
			})
		} catch (error) {
			console.log(error);
		}
	}

	const handleQuestionUpdate = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/update/${updateId}`;

		let data = [
			{ "propName": "description", "value": newQuestion },
			{
				"propName": "options", "value": [
					{
						"text": option1
					},
					{
						"text": option2
					},
					{
						"text": option3
					},
					{
						"text": option4
					}
				]
			},
			{ "propName": "correctAnswer", "value": correctOption }
		]

		try {
			await axios.patch(url, data, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				onCloseHandle();
				getQuizDetails();
			})
		} catch (error) {
			console.log(error);
		}
	}

	const validate = () => {
		if (newQuestion.trim().length === 0) {
			setNewQuestionError(true);
			return false;
		}

		if (option1.trim().length === 0) {
			setOption1Error(true);
			return false;
		}
		if (option2.trim().length === 0) {
			setOption2Error(true);
			return false;
		}
		if (option3.trim().length === 0) {
			setOption3Error(true);
			return false;
		}
		if (option4.trim().length === 0) {
			setOption4Error(true);
			return false;
		}

		if (correctOption === -1) {
			setCorrectOptionError(true);
			return false;
		}

		return true;
	}

	const handleQuestionSubmit = async () => {
		//TODO: Handle Validation

		if (!validate()) return;

		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/add`;

		let options = [
			{ "text": option1 }, { "text": option2 }, { "text": option3 }, { "text": option4 },
		]

		let data = {
			"quizId": quizId,
			"description": newQuestion,
			"options": options,
			"correctAnswer": correctOption
		}

		try {
			await axios.post(url, data, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				clearModal();
				getQuizDetails();
				setQuestionModal(false);
			})
		} catch (error) {
			console.log(error);
		}

	}

	const isOwnerOfQuiz = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/checkAdmin/${quizId}`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				return true;
			})
		} catch(error) {
			setRedirect(true);
			return;
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
			})
		} catch (error) {
			console.log(error);
		}

		url = `https://quizzie-api.herokuapp.com/admin/allStudentsQuizResult/${quizId}`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				setResponses(res.data.userResults);
				setLoading(false);
			})
		} catch(error) {
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

		isOwnerOfQuiz();
		getQuizDetails();
	}, [])

	if (loading) {
		return (
			<Loading />
		)
	} else if (redirect) {
		return (
			<Redirect to="/dashboard" />
		)
	} else if(responseRedir) {
		return (
			<Redirect to={{
				pathname: "/studentResponse",
				state: {
					response: currResponse
				}
			}} />
		)
	}
	else {
		return (
			<Container className="edit-quiz-page">
				<Typography variant="h3" className="dash-head p-top edit-quiz-head">Edit Quiz</Typography>
				<div className="edit-btn-bar">
					<Button className="edit-details-btn" component={Link} to={`/updateQuizDetails/${quizId}`}>
						<Create className="edit-icon" />Edit Details
					</Button>
					<Button className="edit-details-btn delete-btn" onClick={handleDeleteBtn}>
						<Delete className="edit-icon" />Delete Quiz
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
						<div className="add-question-bar">
							<Button className="add-question-btn" onClick={() => setQuestionModal(true)}>Add a question</Button>
						</div>
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
											<FormControlLabel
												style={{ marginRight: '0' }}
												aria-label="Edit"
												control={<IconButton><Create /></IconButton>}
												// label={question.description} 
												onClick={() => handleQuestionEditBtn(question)} />
											<FormControlLabel
												aria-label="Edit"
												control={<IconButton><Delete /></IconButton>}
												// label={question.description} 
												onClick={() => handleQuestionDeleteBtn(question)} />
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
					<Typography variant="h4" className="quiz-questions-head m-top">Submissions</Typography>
					<div className="quiz-students-list">
						{responses.length === 0? <p style={{ textAlign: 'center' }}>No responses yet!</p>
						: 
						<List aria-label="responses list">
							{responses.map((response) => (
								<ListItem button key={response._id} onClick={() => studentResonse(response)} >
									<ListItemText primary={response.userId.name} secondary={`Scored: ${response.marks}`} />
								</ListItem>
							))}
						</List>
						}
					</div>
				</div>
				<Dialog open={questionModal} onClose={onCloseHandle} aria-labelledby="add-question-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '50%' } }}
					style={{ width: '100%' }}>
					<Typography variant="h6" style={{ textAlign: 'center', margin: '2% 5%' }}>New Question</Typography>
					<div className="new-question-form">
						<TextInput
							error={newQuestionError}
							helperText={newQuestionError ? "This cannot be empty" : null}
							className="new-ques-input"
							variant="outlined"
							label="Question Text"
							value={newQuestion}
							onChange={onQuestionChange} />
						<hr style={{ width: '100%', marginBottom: '3%' }} />
						<Grid container spacing={1}>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option1Error}
									helperText={option1Error ? "This cannot be empty" : null}
									className="new-ques-input"
									variant="outlined"
									label="Option 1"
									value={option1}
									onChange={handleOptionChange1} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option2Error}
									helperText={option2Error ? "This cannot be empty" : null}
									className="new-ques-input"
									variant="outlined"
									label="Option 2"
									value={option2}
									onChange={handleOptionChange2} />
							</Grid>
						</Grid>
						<Grid container spacing={1}>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option3Error}
									helperText={option3Error ? "This cannot be empty" : null}
									className="new-ques-input"
									variant="outlined"
									label="Option 3"
									value={option3}
									onChange={handleOptionChange3} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option4Error}
									helperText={option4Error ? "This cannot be empty" : null}
									className="new-ques-input"
									variant="outlined"
									label="Option 4"
									value={option4}
									onChange={handleOptionChange4} />
							</Grid>
						</Grid>
						<hr style={{ width: '100%', marginBottom: '3%' }} />
						<InputLabel id="correct-option">Correct Option</InputLabel>
						<Select
							error={correctOptionError}
							className="correct-answer-select"
							style={{ width: '50%' }}
							labelId="correct-option"
							value={correctOption}
							onChange={handleCorrectOption}
						>
							<MenuItem value={-1}>None</MenuItem>
							{option1.trim().length !== 0 ? <MenuItem value={option1}>{option1}</MenuItem> : null}
							{option2.trim().length !== 0 ? <MenuItem value={option2}>{option2}</MenuItem> : null}
							{option3.trim().length !== 0 ? <MenuItem value={option3}>{option3}</MenuItem> : null}
							{option4.trim().length !== 0 ? <MenuItem value={option4}>{option4}</MenuItem> : null}
						</Select>
						{!update ?
							<Button className="add-question-submit" onClick={handleQuestionSubmit}>Add Question</Button>
							:
							<Button className="add-question-submit" onClick={handleQuestionUpdate}>Update Question</Button>}
					</div>
				</Dialog>
				<Dialog open={deleteModal} onClose={() => setDeleteModal(false)} aria-labelledby="delete-quiz-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: 'black', minWidth: '10%' } }}>
					<DialogTitle>Are you sure you want to delete this quiz?</DialogTitle>
					<div className="btn-div">
						<Button className="logout-btn m-right bg-red-btn" onClick={handleDelete}>Yes</Button>
						<Button className="cancel-btn m-left" onClick={() => setDeleteModal(false)}>No</Button>
					</div>
				</Dialog>
				<Dialog open={deleteQuestionModal} onClose={handleQuestionModalClose} aria-labelledby="delete-quiz-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: 'black', minWidth: '10%' } }}>
					<DialogTitle>Are you sure you want to delete this question?</DialogTitle>
					<div className="btn-div">
						<Button className="logout-btn m-right bg-red-btn" onClick={handleDeleteQuestion}>Yes</Button>
						<Button className="cancel-btn m-left" onClick={handleQuestionModalClose}>No</Button>
					</div>
				</Dialog>
			</Container>
		)
	}
}

export default EditQuiz;