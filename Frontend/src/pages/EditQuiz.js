import React, { useEffect, useState } from "react";
import "./EditQuiz.css";
import {
	Container,
	Typography,
	Button,
	Dialog,
	Grid,
	InputLabel,
	Select,
	MenuItem,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	FormControlLabel,
	IconButton,
	DialogTitle,
	Input,
	TextField,
	Divider,
	Popover,
	Snackbar,
} from "@material-ui/core";
import {
	Create,
	ExpandMore,
	Adjust,
	Delete,
	BarChart,
	Replay,
	AddCircle,
	Info,
} from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import TextInput from "../components/TextInput";
import Dropzone from "react-dropzone";
import csv from "csv";
import { Alert } from "@material-ui/lab";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function EditQuiz(props) {
	const quizId = props.match.params.id;

	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	const [quizDetails, setQuizDetails] = useState({});
	const [quizQuestions, setQuizQuestions] = useState([]);

	const [fileError, setFileError] = useState(false);
	const [serverError, setServerError] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const popoverOpen = Boolean(popoverAnchor);

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

	const [quizRestartModal, setQuizRestartModal] = useState(false);
	const [closeQuizModal, setCloseQuizModal] = useState(false);

	const [responses, setResponses] = useState([]);

	const [searchData, setSearchData] = useState(responses);
	const [searchText, setSearchText] = useState("");
	const [sortBy, setSortBy] = useState(-1);

	const { executeRecaptcha } = useGoogleReCaptcha();

	const onCloseHandle = () => {
		setQuestionModal(false);
		if (update) {
			setUpdate(false);
			setUpdateId(null);
			clearModal();
		}
	};

	const handlePopover = (event) => {
		setPopoverAnchor(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setPopoverAnchor(null);
	};

	const onQuestionChange = (event) => {
		setNewQuestion(event.target.value);
	};

	const handleOptionChange1 = (event) => {
		setOption1(event.target.value);
	};
	const handleOptionChange2 = (event) => {
		setOption2(event.target.value);
	};
	const handleOptionChange3 = (event) => {
		setOption3(event.target.value);
	};
	const handleOptionChange4 = (event) => {
		setOption4(event.target.value);
	};

	const handleCorrectOption = (event) => {
		setCorrectOption(event.target.value);
	};

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
	};

	const handleFileDrop = (files) => {
		const reader = new FileReader();

		let questions = [];

		reader.onabort = () => {
			setFileError(true);
			return;
		};
		reader.onerror = () => {
			setFileError(true);
			return;
		};

		reader.onload = () => {
			csv.parse(reader.result, (err, data) => {
				if (data === undefined) {
					setFileError(true);
					return;
				}
				data.map((question) => {
					if (question[0].trim() === "") {
						return null;
					}
					let obj = {
						quizId: quizId,
						description: question[0],
						options: [
							{ text: question[1] },
							{ text: question[2] },
							{ text: question[3] },
							{ text: question[4] },
						],
						correctAnswer: question[5],
					};

					questions.push(obj);
				});
				submitCSV(questions);
			});
		};

		reader.readAsBinaryString(files[0]);
	};

	const submitCSV = async (questions) => {
		setLoading(true);
		let token = localStorage.getItem("authToken");
		let url = "https://quizzie-api.herokuapp.com/question/csv";

		let captcha = await executeRecaptcha("submit_csv");

		let data = {
			questions: questions,
			captcha: captcha,
		};

		try {
			await axios
				.post(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					console.log(res);
					setLoading(false);
					clearModal();
					onCloseHandle();
					getQuizDetails();
				});
		} catch (error) {
			setServerError(true);
			console.log(error);
		}
	};

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);

		let newRes = responses.filter(
			(response) =>
				response.userId.name
					.toLowerCase()
					.search(event.target.value.trim().toLowerCase()) !== -1 ||
				String(response.marks) ===
					event.target.value.trim().toLowerCase()
		);
		let sorted = sortByFunc(sortBy, newRes);

		setSearchData(sorted);
	};

	const handleSortChange = (event) => {
		setSortBy(event.target.value);

		let newRes = sortByFunc(event.target.value, searchData);

		setSearchData(newRes);
	};

	const sortByFunc = (by, array) => {
		if (by === "score") {
			return array.sort(function (a, b) {
				return b.marks - a.marks;
			});
		} else if (by === "name") {
			return array.sort(function (a, b) {
				return a.userId.name - b.userId.name;
			});
		} else if (by === "recent") {
			return array.sort(function (a, b) {
				return b.timeEnded - a.timeEnded;
			});
		} else {
			return array;
		}
	};

	const handleRestart = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/restart`;

		let captcha = await executeRecaptcha("restart_quiz");

		let data = {
			quizId: quizId,
			captcha: captcha,
		};

		try {
			await axios
				.patch(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setQuizRestartModal(false);
					getQuizDetails();
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleQuizClose = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/close`;

		let captcha = await executeRecaptcha("quiz_close");

		let data = {
			quizId: quizId,
			captcha: captcha,
		};

		try {
			await axios
				.patch(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setCloseQuizModal(false);
					getQuizDetails();
				});
		} catch (error) {
			console.log(error);
		}
	};

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
	};

	const handleQuestionDeleteBtn = (question) => {
		setUpdateId(question._id);
		setDeleteQuestionModal(true);
	};

	const handleQuestionModalClose = () => {
		setUpdateId(null);
		setDeleteQuestionModal(false);
	};

	const handleDeleteBtn = () => {
		setDeleteModal(true);
	};

	const handleDeleteQuestion = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/${updateId}`;

		// let captcha = executeRecaptcha("delete_quiz");

		try {
			await axios
				.delete(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setUpdateId(null);
					setDeleteQuestionModal(false);
					getQuizDetails();
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/delete`;

		let data = {
			quizId: quizId,
		};

		try {
			await axios
				.delete(url, {
					headers: {
						"auth-token": token,
					},
					data: data,
				})
				.then((res) => {
					setRedirect(true);
				});
		} catch (error) {
			console.log(error);
		}
	};

	const handleQuestionUpdate = async () => {
		if (!validate()) return;

		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/update/${updateId}`;

		let captcha = await executeRecaptcha("question_update");

		let updateOps = [
			{ propName: "description", value: newQuestion },
			{
				propName: "options",
				value: [
					{
						text: option1,
					},
					{
						text: option2,
					},
					{
						text: option3,
					},
					{
						text: option4,
					},
				],
			},
			{ propName: "correctAnswer", value: correctOption },
		];

		let data = {
			updateOps: updateOps,
			captcha: captcha,
		};

		try {
			await axios
				.patch(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					onCloseHandle();
					getQuizDetails();
				});
		} catch (error) {
			console.log(error);
		}
	};

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
	};

	const handleQuestionSubmit = async () => {
		//TODO: Handle Validation

		if (!validate()) return;

		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/question/add`;

		let captcha = await executeRecaptcha("submit_question");

		let options = [
			{ text: option1 },
			{ text: option2 },
			{ text: option3 },
			{ text: option4 },
		];

		let data = {
			quizId: quizId,
			description: newQuestion,
			options: options,
			correctAnswer: correctOption,
			captcha: captcha,
		};

		try {
			await axios
				.post(url, data, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					clearModal();
					getQuizDetails();
					setQuestionModal(false);
				});
		} catch (error) {
			console.log(error);
		}
	};

	const isOwnerOfQuiz = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/checkAdmin/${quizId}`;

		try {
			await axios
				.get(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					return true;
				});
		} catch (error) {
			setRedirect(true);
			return;
		}
	};

	const getQuizDetails = async () => {
		setLoading(true);
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/quiz/${quizId}`;

		try {
			await axios
				.get(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setQuizDetails(res.data.result);
				});
		} catch (error) {
			console.log(error);
		}

		url = `https://quizzie-api.herokuapp.com/question/all/${quizId}`;

		try {
			await axios
				.get(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setQuizQuestions(res.data.result);
				});
		} catch (error) {
			console.log(error);
		}

		url = `https://quizzie-api.herokuapp.com/admin/allStudentsQuizResult/${quizId}`;

		try {
			await axios
				.get(url, {
					headers: {
						"auth-token": token,
					},
				})
				.then((res) => {
					setResponses(res.data.userResults);
					setSearchData(res.data.userResults);
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		let token = localStorage.getItem("authToken");
		if (token === null) {
			setLoading(false);
			setRedirect(true);
			return;
		}

		isOwnerOfQuiz();
		getQuizDetails();
	}, []);

	if (loading) {
		return <Loading />;
	} else if (redirect) {
		return <Redirect to="/dashboard" />;
	} else {
		return (
			<Container className="edit-quiz-page">
				<Typography
					variant="h3"
					className="dash-head p-top edit-quiz-head"
				>
					Edit Quiz
				</Typography>
				<div className="edit-btn-bar">
					<Button
						className="edit-details-btn"
						component={Link}
						to={`/updateQuizDetails/${quizId}`}
					>
						<Create className="edit-icon" />
						Edit Details
					</Button>
					<Button
						className="edit-details-btn delete-btn"
						onClick={handleDeleteBtn}
					>
						<Delete className="edit-icon" />
						Delete Quiz
					</Button>
					{quizDetails.quizStatus === 1 ? (
						<Button
							className="edit-details-btn"
							style={{ marginLeft: "3%" }}
							onClick={() => setCloseQuizModal(true)}
						>
							<Replay className="edit-quiz" />
							Close Quiz
						</Button>
					) : quizDetails.quizStatus === 2 ? (
						<Button
							className="edit-details-btn"
							style={{ marginLeft: "3%" }}
							onClick={() => setQuizRestartModal(true)}
						>
							<Replay className="edit-quiz" />
							Restart Quiz
						</Button>
					) : null}
				</div>
				<div className="quiz-details-sec">
					<Typography variant="h6" className="quiz-detail-param">
						Name:{" "}
						<span className="quiz-detail-text">
							{quizDetails.quizName}
						</span>
					</Typography>
					<Typography variant="h6" className="quiz-detail-param">
						Date:{" "}
						<span className="quiz-detail-text">
							{new Date(
								Number(quizDetails.scheduledFor)
							).toDateString()}
						</span>
					</Typography>
					<Typography variant="h6" className="quiz-detail-param">
						Time:{" "}
						<span className="quiz-detail-text">
							{new Date(
								Number(quizDetails.scheduledFor)
							).toLocaleTimeString()}
						</span>
					</Typography>
					<Typography variant="h6" className="quiz-detail-param">
						Duration:{" "}
						<span className="quiz-detail-text">
							{quizDetails.quizDuration} minutes
						</span>
					</Typography>
					<Typography variant="h6" className="quiz-detail-param">
						Type:{" "}
						<span className="quiz-detail-text">
							{quizDetails.quizType}
						</span>
					</Typography>
					{quizDetails.quizType === "private" ? (
						<Typography variant="h6" className="quiz-detail-param">
							Quiz Code:{" "}
							<span className="quiz-detail-text">
								{quizDetails.quizCode}
							</span>
						</Typography>
					) : null}
				</div>
				<div className="quiz-questions-sec">
					<Typography variant="h4" className="quiz-questions-head">
						Questions
					</Typography>
					<div className="quiz-questions-display">
						<div className="add-question-bar">
							<Button
								className="add-question-btn"
								onClick={() => setQuestionModal(true)}
							>
								Add a question
							</Button>
						</div>
						{quizQuestions.length === 0 ? (
							<p style={{ textAlign: "center" }}>
								No questions added yet!
							</p>
						) : (
							<div className="questions-list-display">
								{quizQuestions.map((question) => (
									<ExpansionPanel
										elevation={3}
										className="expansion"
										key={question._id}
									>
										<ExpansionPanelSummary
											className="question-summary"
											expandIcon={<ExpandMore />}
											aria-controls="question-content"
											aria-label="Expand"
										>
											<FormControlLabel
												style={{ marginRight: "0" }}
												aria-label="Edit"
												control={
													<IconButton>
														<Create />
													</IconButton>
												}
												// label={question.description}
												onClick={() =>
													handleQuestionEditBtn(
														question
													)
												}
											/>
											<FormControlLabel
												aria-label="Edit"
												control={
													<IconButton>
														<Delete />
													</IconButton>
												}
												// label={question.description}
												onClick={() =>
													handleQuestionDeleteBtn(
														question
													)
												}
											/>
											<Typography className="question-label">
												{question.description}
											</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
											<List
												component="nav"
												className="options-display"
											>
												{question.options.map(
													(option) => (
														<ListItem
															button
															key={option._id}
														>
															<ListItemIcon>
																<Adjust
																	style={{
																		color:
																			question.correctAnswer ===
																			option.text
																				? "green"
																				: "black",
																	}}
																/>
															</ListItemIcon>
															<ListItemText
																style={{
																	color:
																		question.correctAnswer ===
																		option.text
																			? "green"
																			: "black",
																}}
																primary={
																	option.text
																}
															/>
														</ListItem>
													)
												)}
											</List>
										</ExpansionPanelDetails>
									</ExpansionPanel>
								))}
							</div>
						)}
					</div>
					<Typography
						variant="h4"
						className="quiz-questions-head m-top"
					>
						Submissions
					</Typography>
					<div className="quiz-students-list">
						<div className="add-question-bar">
							<Button
								className="add-question-btn stats-btn"
								component={
									responses.length !== 0 ? Link : Button
								}
								to={{
									pathname: "/quizStats",
									state: { responses: responses },
								}}
							>
								<BarChart />
								View Stats
							</Button>
						</div>
						{responses.length === 0 ? (
							<p
								style={{
									textAlign: "center",
									margin: "0",
									paddingTop: "3%",
									paddingBottom: "3%",
								}}
							>
								No responses yet!
							</p>
						) : (
							<>
								<div className="search-bar">
									<TextField
										placeholder="Search by name or score"
										type="text"
										onChange={handleSearchChange}
										className="search-input"
										value={searchText}
									/>
									<div style={{ marginLeft: "3%" }}>
										<InputLabel id="sort-by">
											Sort by
										</InputLabel>
										<Select
											labelId="sort-by"
											id="sort-select"
											value={sortBy}
											onChange={handleSortChange}
										>
											<MenuItem value={-1}>
												<em>None</em>
											</MenuItem>
											<MenuItem value="recent">
												Recent
											</MenuItem>
											<MenuItem value="score">
												Score
											</MenuItem>
											<MenuItem value="name">
												Name
											</MenuItem>
										</Select>
									</div>
								</div>
								<List aria-label="responses list">
									{searchData.map((response) => (
										<ListItem
											button
											key={response._id}
											component={Link}
											to={{
												pathname: `/studentResponse`,
												state: { response: response },
											}}
										>
											<ListItemText
												primary={response.userId.name}
												secondary={`Scored: ${response.marks}`}
											/>
										</ListItem>
									))}
								</List>
							</>
						)}
					</div>
				</div>
				<Dialog
					open={questionModal}
					onClose={onCloseHandle}
					aria-labelledby="add-question-modal"
					PaperProps={{
						style: {
							backgroundColor: "white",
							color: "#333",
							minWidth: "50%",
						},
					}}
					style={{ width: "100%" }}
				>
					<div className="add-ques-heading">
						<Typography
							variant="h6"
							style={{ textAlign: "center", margin: "2% 5%" }}
						>
							New Question{" "}
						</Typography>
						{!update ? (
							<IconButton onClick={handlePopover}>
								<Info className="add-info-icon" />
							</IconButton>
						) : null}
						<Popover
							id="file-upload-popover"
							open={popoverOpen}
							anchorEl={popoverAnchor}
							onClose={handlePopoverClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							disableRestoreFocus
							useLayerForClickAway={false}
							PaperProps={{ style: { maxWidth: "400px" } }}
						>
							<p className="popover-text">
								You can upload a <strong>.csv</strong> file with
								questions. The format should be: the{" "}
								<strong>
									first column should contain the question
									text.
								</strong>{" "}
								The next 4 columns must contain the{" "}
								<strong>four options.</strong> And the sixth
								column should contain{" "}
								<strong>
									the correct answer (it should match one of
									the four options)
								</strong>
								. <br />
								<br />
								<strong>
									NOTE: THE FILE SHOULD EXACTLY MATCH THE
									GIVEN FORMAT.
								</strong>{" "}
								You will be able to see and edit all the
								question though.
							</p>
						</Popover>
					</div>
					{!update ? (
						<>
							<div className="dropzone">
								<Dropzone
									onDrop={(acceptedFiles) =>
										handleFileDrop(acceptedFiles)
									}
								>
									{({ getRootProps, getInputProps }) => (
										<section>
											<div {...getRootProps()}>
												<input {...getInputProps()} />
												<AddCircle className="drop-icon" />
												<p
													style={{
														color:
															"rgb(110, 110, 110)",
													}}
												>
													Drag 'n' drop or click to
													select files
												</p>
											</div>
										</section>
									)}
								</Dropzone>
							</div>
							<p className="manual-head">
								<span>Or manually add the question</span>
							</p>
						</>
					) : null}
					<div className="new-question-form">
						<TextInput
							error={newQuestionError}
							helperText={
								newQuestionError ? "This cannot be empty" : null
							}
							className="new-ques-input"
							variant="outlined"
							label="Question Text"
							value={newQuestion}
							onChange={onQuestionChange}
						/>
						<hr style={{ width: "100%", marginBottom: "3%" }} />
						<Grid container spacing={1}>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option1Error}
									helperText={
										option1Error
											? "This cannot be empty"
											: null
									}
									className="new-ques-input"
									variant="outlined"
									label="Option 1"
									value={option1}
									onChange={handleOptionChange1}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option2Error}
									helperText={
										option2Error
											? "This cannot be empty"
											: null
									}
									className="new-ques-input"
									variant="outlined"
									label="Option 2"
									value={option2}
									onChange={handleOptionChange2}
								/>
							</Grid>
						</Grid>
						<Grid container spacing={1}>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option3Error}
									helperText={
										option3Error
											? "This cannot be empty"
											: null
									}
									className="new-ques-input"
									variant="outlined"
									label="Option 3"
									value={option3}
									onChange={handleOptionChange3}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextInput
									error={option4Error}
									helperText={
										option4Error
											? "This cannot be empty"
											: null
									}
									className="new-ques-input"
									variant="outlined"
									label="Option 4"
									value={option4}
									onChange={handleOptionChange4}
								/>
							</Grid>
						</Grid>
						<hr style={{ width: "100%", marginBottom: "3%" }} />
						<InputLabel id="correct-option">
							Correct Option
						</InputLabel>
						<Select
							error={correctOptionError}
							className="correct-answer-select"
							style={{ width: "50%" }}
							labelId="correct-option"
							value={correctOption}
							onChange={handleCorrectOption}
						>
							<MenuItem value={-1}>None</MenuItem>
							{option1.trim().length !== 0 ? (
								<MenuItem value={option1}>{option1}</MenuItem>
							) : null}
							{option2.trim().length !== 0 ? (
								<MenuItem value={option2}>{option2}</MenuItem>
							) : null}
							{option3.trim().length !== 0 ? (
								<MenuItem value={option3}>{option3}</MenuItem>
							) : null}
							{option4.trim().length !== 0 ? (
								<MenuItem value={option4}>{option4}</MenuItem>
							) : null}
						</Select>
						{!update ? (
							<Button
								className="add-question-submit"
								onClick={handleQuestionSubmit}
							>
								Add Question
							</Button>
						) : (
							<Button
								className="add-question-submit"
								onClick={handleQuestionUpdate}
							>
								Update Question
							</Button>
						)}
					</div>
				</Dialog>
				<Dialog
					open={deleteModal}
					onClose={() => setDeleteModal(false)}
					aria-labelledby="delete-quiz-modal"
					PaperProps={{
						style: {
							backgroundColor: "white",
							color: "black",
							minWidth: "10%",
						},
					}}
				>
					<DialogTitle>
						Are you sure you want to delete this quiz?
					</DialogTitle>
					<div className="btn-div">
						<Button
							className="logout-btn m-right bg-red-btn"
							onClick={handleDelete}
						>
							Yes
						</Button>
						<Button
							className="cancel-btn m-left"
							onClick={() => setDeleteModal(false)}
						>
							No
						</Button>
					</div>
				</Dialog>
				<Dialog
					open={deleteQuestionModal}
					onClose={handleQuestionModalClose}
					aria-labelledby="delete-quiz-modal"
					PaperProps={{
						style: {
							backgroundColor: "white",
							color: "black",
							minWidth: "10%",
						},
					}}
				>
					<DialogTitle>
						Are you sure you want to delete this question?
					</DialogTitle>
					<div className="btn-div">
						<Button
							className="logout-btn m-right bg-red-btn"
							onClick={handleDeleteQuestion}
						>
							Yes
						</Button>
						<Button
							className="cancel-btn m-left"
							onClick={handleQuestionModalClose}
						>
							No
						</Button>
					</div>
				</Dialog>
				<Dialog
					open={quizRestartModal}
					onClose={() => setQuizRestartModal(false)}
					aria-labelledby="restart-quiz-modal"
					PaperProps={{
						style: {
							backgroundColor: "white",
							color: "black",
							minWidth: "10%",
						},
					}}
				>
					<DialogTitle>
						Are you sure you want to restart this quiz?
					</DialogTitle>
					<div className="btn-div">
						<Button
							className="logout-btn m-right bg-green-btn"
							onClick={handleRestart}
						>
							Yes
						</Button>
						<Button
							className="cancel-btn m-left bg-red-btn"
							onClick={() => setQuizRestartModal(false)}
						>
							No
						</Button>
					</div>
				</Dialog>
				<Dialog
					open={closeQuizModal}
					onClose={() => setCloseQuizModal(false)}
					aria-labelledby="restart-quiz-modal"
					PaperProps={{
						style: {
							backgroundColor: "white",
							color: "black",
							minWidth: "10%",
						},
					}}
				>
					<DialogTitle>
						Are you sure you want to close this quiz?
					</DialogTitle>
					<div className="btn-div">
						<Button
							className="logout-btn m-right bg-green-btn"
							onClick={handleQuizClose}
						>
							Yes
						</Button>
						<Button
							className="cancel-btn m-left bg-red-btn"
							onClick={() => setCloseQuizModal(false)}
						>
							No
						</Button>
					</div>
				</Dialog>
				<Snackbar
					open={fileError}
					autoHideDuration={3000}
					onClose={() => setFileError(false)}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				>
					<Alert
						variant="filled"
						severity="error"
						onClose={() => setFileError(false)}
					>
						There was some problem with the file. Try again...
					</Alert>
				</Snackbar>
				<Snackbar
					open={serverError}
					autoHideDuration={3000}
					onClose={() => setServerError(false)}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				>
					<Alert
						variant="filled"
						severity="error"
						onClose={() => setServerError(false)}
					>
						There was some problem with the server. Try again...
					</Alert>
				</Snackbar>
			</Container>
		);
	}
}

export default EditQuiz;
