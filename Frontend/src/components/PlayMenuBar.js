import React, { useContext, useState } from "react";
import { Grid, Button, Typography, Dialog, DialogTitle } from "@material-ui/core";
import { Link } from "react-router-dom";
import './PlayMenuBar.css';
import InfoContext from '../context/InfoContext';

function PlayMenuBar() {
	const { isLoggedIn, isAdmin, testGiven, blocked, ccStarted, closed } = useContext(InfoContext);
	const [modalOpen, setModalOpen] = useState(false);

	const onCloseHandle = () => {
		setModalOpen(false);
	}

	const handleClick = () => {
		setModalOpen(true);
	}

	if (closed) {
		return (
			<div className="play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6} className="not-logged-menu">
						<Typography variant="h4" className="login-msg closed-msg">The quiz submission has been closed.</Typography>
						<Typography variant="h6" className="login-msg">Thanks for attending!</Typography>
						<div className="button-bar">
							<Link to="/leaderboard" className="link">
								<Button size="large" className="view-marks-button"><p className="marks-btn-text">View Leaderboard</p></Button>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
	else if (!isLoggedIn) {
		return (
			<div className="play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6} className="not-logged-menu">
						<Typography variant="h4" className="login-msg">You are not logged in!</Typography>
						<Typography variant="h6" className="login-msg">Login/Signup to continue!</Typography>
						<div className="button-bar">
							<Link to="/login" className="link">
								<Button size="large" className="action-button login-button">Login</Button>
							</Link>
							<Link to="/register" className="link">
								<Button size="large" className="action-button signup-button">SignUp</Button>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	} else if (testGiven) {
		return (
			<div className="thanks play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6}>
						<div className="play-menu">
							{isAdmin ? <Link to="/admin" className="link">
								<Button size="small" className="admin-btn">Admin Panel</Button>
							</Link> : null}
							<Typography variant="h5" className="onetime-warning thank-text">Thanks for giving the test!</Typography>
							<Link to="/marks" className="link">
								<Button size="medium" className="view-marks-button"><p className="marks-btn-text">View Marks</p></Button>
							</Link>
						</div>
					</Grid>
				</Grid>

			</div>
		)
	}
	else if (blocked) {
		return (
			<div className="blocked play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6}>
						<div className="play-menu">
							{isAdmin ? <Link to="/admin" className="link">
								<Button size="small" className="admin-btn">Admin Panel</Button>
							</Link> : null}
							<Typography variant="h5" className="onetime-warning thank-text">You have been blocked for violating our rules!</Typography>
						</div>
					</Grid>
				</Grid>

			</div>
		)
	}
	else if (isLoggedIn) {
		return (
			<div className="play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6}>
						<div className="play-menu">
							{isAdmin ? <Link to="/admin" className="link">
								<Button size="small" className="admin-btn">Admin Panel</Button>
							</Link> : null}<br />
							<Button size="large" className="quiz-button" onClick={handleClick}><p className="button-text">Start Quiz</p></Button>
							<Typography variant="h6" className="onetime-warning">NOTE: You can only take the quiz once!</Typography>
						</div>
					</Grid>
				</Grid>
				<Dialog open={modalOpen} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
					PaperProps={{ style: { backgroundColor: '#2d2d2d', color: '#cfcfcf', minWidth: '50%' } }}
					style={{ width: '100%' }}>
					<DialogTitle><p className="modal-head">Important Information</p></DialogTitle>
					<div className="modal-info">
						<Typography variant="h6" className="modal-text bold">1) AFTER STARTING THE QUIZ, PLEASE DO NOT REFRESH OR CLOSE THE WEBSITE.
												YOU WILL BE GIVEN TWO CHANCES, AFTER WHICH YOU WILL BE BANNED FROM GIVING THE QUIZ AGAIN.</Typography>
						<Typography variant="h6" className="modal-text">2) The quiz contains two sections, the Hunger Games Trivia and Competitive Coding.</Typography>
						<Typography variant="h6" className="modal-text">4) You will be given 10 minutes for each section, that is, 20 minutes for the whole quiz.</Typography>
						<Typography variant="h6" className="modal-text">5) The first section contains 25 questions and the second section contains 10 questions, of the MCQ format.
												 There is no negative marking.</Typography>
						<Typography variant="h6" className="modal-text">6) This quiz can be submitted only once.</Typography>
						<Typography variant="h6" className="modal-text">7) After submitting the quiz, you will be able to see your marks.</Typography>
						<Typography variant="h5" className="modal-text bold">8) IMPORTANT: IF YOU LEAVE THE QUIZ PAGE WITHOUT HITTING THE SUBMIT BUTTON,
												YOUR ATTEMPT WILL NOT COUNT!</Typography>
						{!ccStarted ? (<Link to="/quiz" className="link">
							<Button className="quiz-modal-btn">Let's Go!</Button>
						</Link>)
							: (
								<Link to="/ccquiz" className="link">
									<Button className="quiz-modal-btn">Let's Go!</Button>
								</Link>
							)}
					</div>
				</Dialog>
			</div>
		);
	}
}

export default PlayMenuBar;