import React, { useContext, useEffect, useState } from "react";
import {AppBar, Typography, Toolbar, Button, Dialog, DialogTitle} from "@material-ui/core";
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './Navbar.css';
import InfoContext from '../context/InfoContext';

function Navbar() {
	const {isLoggedIn, setLoggedIn, name} = useContext(InfoContext);
	const [navLoggedIn, setNavLoggedIn] = useState(false);
	const [navName, setNavName] = useState(null);
	const [redirect, setRedirect] = useState(false);

	const [open, setOpen] = useState(false);
	const [loginModalOpen, setLoginModalOpen] = useState(false);

	const onCloseHandle = () => {
		setOpen(false);
		setLoginModalOpen(false);
	}
	const handleLogoutBtn = () => {
		setOpen(true);
	}

	const handleLogout = () => {
		localStorage.clear();
		setLoggedIn(false);
		setOpen(false);
		setRedirect(true);

		setInterval(() => {
			setRedirect(false);
		}, 1000)
	}

	useEffect(() => {
		let loggedin = localStorage.getItem("userLoggedIn");
		if(loggedin === "true") {
			setNavLoggedIn(true);
			setNavName(localStorage.getItem("name").split(" ")[0]);
		} else {
			setNavLoggedIn(isLoggedIn);
			if(name !== null) setNavName(name.split(" ")[0]);
		}
	})

	return (
		<div className="root">
			{ redirect ?	<Redirect to="/" /> : null}
			<AppBar position="static" className="navbar" elevation={4}>
				<Toolbar>
					<Link to="/" className="nav-link"><img src="../CC LOGO-01.svg" className="nav-logo"/></Link>
					<Typography varirant="h6" className="nav-head">The Quizzie Platform</Typography>
					<div className="btn-bar">
						{navLoggedIn === false?
							<Button color="inherit" className="login" onClick={() => setLoginModalOpen(true)}>Login</Button>
							:
							<Typography variant="h6" className="nav-user">Welcome, {navName}</Typography>
							
						}
						{navLoggedIn? <Button className="logout-btn" onClick={handleLogoutBtn}>Logout</Button>: null}
					</div>
				</Toolbar>
			</AppBar>

			<Dialog open={open} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
				PaperProps={{ style: { backgroundColor: 'white', color: 'black', minWidth: '10%', textAlign: 'center' } }}>
				<DialogTitle>Are you sure you want to logout?</DialogTitle>
				<div className="btn-div">
					<Button className="logout-btn m-right" onClick={handleLogout}>Yes</Button>
					<Button className="cancel-btn m-left" onClick={onCloseHandle}>No</Button>
				</div>
			</Dialog>
			<Dialog open={loginModalOpen} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
					PaperProps={{ style: { backgroundColor: 'white', color: '#333', minWidth: '40%' } }}
					style={{ width: '100%' }}>
					<div className="modal-info">
						<Typography variant="h5" className="type-head">Are you a student or an organizer?</Typography>
						<div className="modal-btns">
							<Link to="/login/user" className="link">
								<Button variant="outlined" color="primary" 
									className="modal-select-btn modal-student" 
									onClick={() => setLoginModalOpen(false)}>Student</Button>
							</Link>
							<Link to="/login/organizer" className="link">
								<Button variant="outlined" color="secondary" 
									className="modal-select-btn modal-organizer" 
									onClick={() => setLoginModalOpen(false)}>Organizer</Button>
							</Link>
						</div>
					</div>
				</Dialog>
		</div>
	);
}

export default Navbar;