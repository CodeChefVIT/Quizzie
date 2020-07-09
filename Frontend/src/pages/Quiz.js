import React, { useState, useEffect, useContext } from "react";
import { Grid, Snackbar, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Dialog, DialogTitle,
		Button } from '@material-ui/core'
import './Quiz.css';
import Loading from "./Loading";
import axios from "axios";
import { Redirect } from "react-router-dom";
import InfoContext from "../context/InfoContext";
import SubmitLoading from './SubmitLoading';
import { usePageVisibility } from "react-page-visibility";
import countdown from "countdown";

function Quiz(props) {
	const [currentStep, setStep] = useState(1);

	const [loading, setLoading] = useState(true);
	const [allQuestions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [currentAns, setCurrentAns] = useState(null);

	const [duration, setDuration] = useState(-1);
	const [startTime, setStartTime] = useState(-1);
	const [timeRemaining, setTimeRemaining] = useState(false);

	const [allChosenAns, setAllAns] = useState(null);
	const [redirect, setRedirect] = useState(false);

	const [testCompleted, setTestCompleted] = useState(false);
	const [resultData, setResultData] = useState(null);

	const [submitLoading, setSubmitLoading] = useState(false);

	const [confirmModal, setConfirmModal] = useState(false);

	const pageVisible = usePageVisibility();

	const {setBlocked, closed} = useContext(InfoContext);

	const submitQuiz = async () => {
		setTestCompleted(true);
	}

	const onCloseHandle = () => {
		setConfirmModal(false);
	}

	const handleSubmitBtn = () => {
		setConfirmModal(true);
	}

	const handleSubmit = (event) => {
		submitQuiz();
	}
	const timesUp = () => {
		submitQuiz();
	}
	const _next = () => {
		let currQues = currentQuestion + 1;
		setStep(currentStep + 1)
		setCurrentQuestion(currentQuestion + 1);
		setCurrentAns(allChosenAns[currQues].option);
	}
	const _prev = () => {
		let currQues = currentQuestion - 1;
		setStep(currentStep - 1);
		setCurrentQuestion(currentQuestion - 1);
		setCurrentAns(allChosenAns[currQues].option);
	}
	const previousButton = () => {
		if (currentStep !== 1) {
			return (
				<button
					className="quiz-btn prev-button" onClick={_prev}>
					<p>Previous</p>
				</button>
			)
		}
		return null;
	}

	const nextButton = () => {
		if (currentStep < allQuestions.length) {
			return (
				<button
					className="quiz-btn next-button" onClick={_next}>
					<p>Next</p>
				</button>
			)
		} else if (currentStep === allQuestions.length) {
			return (
				<button
					className="quiz-btn submit-button" onClick={handleSubmitBtn}>
					<p>Submit</p>
				</button>
			)
		}
		return null;
	}

	
	const handleOptionChange = (event) => {
		setCurrentAns(event.target.value);

		let newState = allChosenAns;
		newState[currentQuestion].option = event.target.value;

		setAllAns(newState);
	}

	const setupQuiz = (questions) => {
		let questionsData = [];
		let answerData = [];

		questions.map((question) => {
			let questionObj = {
				q_id: question._id,
				text: question.description,
				options: question.options,
			}
			questionsData.push(questionObj);

			let ansObj = {
				quesId: question._id,
				selectedOption: null,
			}

			answerData.push(ansObj);
		});

		setQuestions(questionsData);
		setAllAns(answerData);
		
		setLoading(false);
	}

	useEffect(() => {
		if(!pageVisible) {
			setRedirect(true);
			return;
		}
	}, [pageVisible])

	useEffect(() => {
		let endTime = Number(startTime) + (duration*60*1000);
		setTimeout(() => {
			setTimeRemaining(countdown(new Date(), new Date(Number(endTime)), countdown.MINUTES | countdown.SECONDS).toString());
		}, 1000)
	});

	useEffect(() => {
		let token = localStorage.getItem('authToken');
		if (token === null) {
			setRedirect(true);
			return;
		}

		if(props.location.state === undefined) {
			setRedirect(true);
			return;
		} else {
			setDuration(props.location.state.duration);
			setStartTime(props.location.state.start);
			setQuestions(props.location.state.questions);
			setupQuiz(props.location.state.questions);
		}
	}, [])

	if (redirect) {
		return (
			<Redirect to={{
				pathname: "/dashboard",
				state: {blocked: true}
			}} />
		)
	} else if(submitLoading) {
		return (
			<SubmitLoading />
		)
	}
	else {
		return (
			loading ? <Loading />
				:
				<div className="quiz-page">
					<Grid container xs={12} spacing={5} className="quiz-container">
						<Grid item xs={10} md={8} lg={7} className="q-count" >
							<h2 style={{ padding: 0 }}>QUESTION {currentStep} OF {allQuestions.length}</h2>
						</Grid>
						<Grid item xs={10} md={8} lg={7} className="timer">
							<p style={{margin: 0}}>Time Remaining <h2 className="rem-time-display">{timeRemaining}</h2></p>
						</Grid>
						<Grid item xs={10} md={8} lg={7} style={{ margin: 0, padding: '2%',  borderBottom: '3px solid #222', minHeight: '30vh' }}>
							<FormControl style={{ margin: 'auto', width: "100%" }} component="fieldset">
								<FormLabel className="label" component="legend"><p className="question">{allQuestions[currentQuestion].text}</p></FormLabel>
								<RadioGroup aria-label="correct-choice" value={currentAns} onChange={handleOptionChange}>
									{allQuestions[currentQuestion].options.map((option) => {
										return (
											<FormControlLabel key={option._id} value={option.text} control={<Radio className="radio" />} label={option.text} style={{ margin: 0 }} />
										)
									})}
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item xs={10} md={8} lg={7} className="button" >
							<Grid item xs={6} className="button">
								{previousButton()}
							</Grid>
							<Grid item xs={6} className="button">
								{nextButton()}
							</Grid>
						</Grid>
					</Grid>

					<Dialog open={confirmModal} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
						PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '10%' } }}>
						<DialogTitle>Are you sure you want to submit the quiz?</DialogTitle>
						<div className="btn-div">
							<Button className="logout-btn m-right" onClick={handleSubmit}>Yes</Button>
							<Button className="cancel-btn m-left" onClick={onCloseHandle}>No</Button>
						</div>
					</Dialog>
				</div>
		)
	}
}

export default Quiz;