import React, { useEffect, useState } from "react";
import './EditQuiz.css';
import { Container, Typography, Button, Dialog, Grid, InputLabel, Select, MenuItem, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import { Create, ExpandMore } from "@material-ui/icons";
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

	const [option1, setOption1] = useState("");
	const [option2, setOption2] = useState("");
	const [option3, setOption3] = useState("");
	const [option4, setOption4] = useState("");
	const [correctOption, setCorrectOption] = useState("nonono");

	const onCloseHandle = () => {
		setQuestionModal(false);
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
		setOption1("");
		setOption2("");
		setOption3("");
		setOption4("");
	}

	const handleQuestionSubmit = async () => {
		//TODO: Handle Validation


		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/add`;

		let options = [
			{"text": option1},{"text": option2},{"text": option3},{"text": option4},
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
		} catch(error) {
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
					{quizDetails.quizType === "private" ?
						<Typography variant="h6" className="quiz-detail-param">Quiz Code: <span className="quiz-detail-text">{quizDetails.quizCode}</span></Typography>
					: null}
				</div>
				<div className="quiz-questions-sec">
					<Typography variant="h4" className="quiz-questions-head">Questions</Typography>
					<div className="quiz-questions-display">
						<div className="add-question-bar">
							<Button variant="filled" className="add-question-btn" onClick={() => setQuestionModal(true)}>Add a question</Button>
						</div>
						{quizQuestions.length === 0? <p style={{ textAlign: 'center' }}>No questions added yet!</p>
						: 
						<div className="questions-list-display">
							{quizQuestions.map((question) => (
								<ExpansionPanel elevation={3}>
									<ExpansionPanelSummary
										expandIcon={<ExpandMore />}
										aria-controls="question-content"
									>
										<Typography>{question.description}</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										{JSON.stringify(question.options)}
									</ExpansionPanelDetails>
								</ExpansionPanel>
							))}
						</div>	
						}
					</div>
				</div>
				<Dialog open={questionModal} onClose={onCloseHandle} aria-labelledby="add-question-modal"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '50%' } }}
					style={{ width: '100%' }}>
					<Typography variant="h6" style={{textAlign: 'center', margin: '2% 5%'}}>New Question</Typography>
					<div className="new-question-form">
						<TextInput
							className="new-ques-input"
							variant="outlined"
							label="Question Text"
							value={newQuestion}
							onChange={onQuestionChange} />
						<hr style={{width: '100%', marginBottom: '3%'}}/>
						<Grid container spacing={1}>
							<Grid item xs={12} sm={6}>
							<TextInput
								className="new-ques-input"
								variant="outlined"
								label="Option 1"
								value={option1}
								onChange={handleOptionChange1} />
							</Grid>
							<Grid item xs={12} sm={6}>
							<TextInput
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
								className="new-ques-input"
								variant="outlined"
								label="Option 3"
								value={option3}
								onChange={handleOptionChange3} />
							</Grid>
							<Grid item xs={12} sm={6}>
							<TextInput
								className="new-ques-input"
								variant="outlined"
								label="Option 4"
								value={option4}
								onChange={handleOptionChange4} />
							</Grid>
						</Grid>
						<hr style={{width: '100%', marginBottom: '3%'}}/>
						<InputLabel id="correct-option">Correct Option</InputLabel>
						<Select
							className="correct-answer-select"
							style={{width: '50%'}}
							labelId="correct-option"
							value={correctOption}
							onChange={handleCorrectOption} 
						>
							<MenuItem value="nonono">None</MenuItem>
							{option1.trim().length !== 0? <MenuItem value={option1}>{option1}</MenuItem> :null }
							{option2.trim().length !== 0? <MenuItem value={option2}>{option2}</MenuItem> :null } 
							{option3.trim().length !== 0? <MenuItem value={option3}>{option3}</MenuItem> :null }
							{option4.trim().length !== 0? <MenuItem value={option4}>{option4}</MenuItem> :null }
						</Select>
						<Button variant="filled" className="add-question-submit" onClick={handleQuestionSubmit}>Add Question</Button>
					</div>
				</Dialog>
			</Container>
		)
	}
}

export default EditQuiz;