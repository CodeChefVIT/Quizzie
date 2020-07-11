import React, { useContext, useState } from "react";
import { Grid, Button, Typography, Dialog, DialogTitle } from "@material-ui/core";
import { Link } from "react-router-dom";
import './PlayMenuBar.css';
import InfoContext from '../context/InfoContext';

function PlayMenuBar() {
	const { isLoggedIn } = useContext(InfoContext);
	const [loginModalOpen, setLoginModalOpen] = useState(false);
	const [registerModalOpen, setRegisterModalOpen] = useState(false);

	const onCloseHandle = () => {
		setLoginModalOpen(false);
		setRegisterModalOpen(false);
	}

	if (!isLoggedIn) {
		return (
			<div className="play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6} className="not-logged-menu">
						<Typography variant="h4" className="login-msg">You are not logged in!</Typography>
						<Typography variant="h6" className="login-msg">Login/Signup to continue!</Typography>
						<div className="button-bar">
							<Button size="large" className="action-button login-button" onClick={() => setLoginModalOpen(true)}>Login</Button>
							<Button size="large" className="action-button signup-button" onClick={() => setRegisterModalOpen(true)}>SignUp</Button>
						</div>
					</Grid>
				</Grid>
				<Dialog open={loginModalOpen} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '40%' } }}
					style={{ width: '100%' }}>
					<div className="modal-info">
						<Typography variant="h5" className="type-head">Are you a student or an organizer?</Typography>
						<div className="modal-btns">
							<Link to="/login/user" className="link">
								<Button variant="outlined" color="primary" className="modal-select-btn modal-student">Student</Button>
							</Link>
							<Link to="/login/organizer" className="link">
								<Button variant="outlined" color="secondary" className="modal-select-btn modal-organizer">Organizer</Button>
							</Link>
						</div>
					</div>
				</Dialog>
				<Dialog open={registerModalOpen} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '40%' } }}
					style={{ width: '100%' }}>
					<div className="modal-info">
						<Typography variant="h5" className="type-head">Are you a student or an organizer?</Typography>
						<div className="modal-btns">
							<Link to="/register/user" className="link">
								<Button variant="outlined" color="primary" className="modal-select-btn modal-student">Student</Button>
							</Link>
							<Link to="/register/organizer" className="link">
								<Button variant="outlined" color="secondary" className="modal-select-btn modal-organizer">Organizer</Button>
							</Link>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
	else if (isLoggedIn) {
		return (
			<div className="play-container">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6}>
						<div className="play-menu">
							<Link to="/dashboard" style={{textDecoration: 'none'}}>
								<Button size="large" className="quiz-button"><p className="button-text">Go to the Dashboard</p></Button>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default PlayMenuBar;