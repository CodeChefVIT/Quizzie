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

	const onCloseHandle = () => {
		setOpen(false);
	}
	const handleLogoutBtn = () => {
		setOpen(true);
	}

	const handleLogout = () => {
		localStorage.clear();
		setLoggedIn(false);
		setOpen(false);
		setRedirect(true);
	}

	useEffect(() => {
		let loggedin = localStorage.getItem("userLoggedIn");
		if(loggedin === "true") {
			setNavLoggedIn(true);
			setNavName(localStorage.getItem("name"));
		} else {
			setNavLoggedIn(isLoggedIn);
			setNavName(name);
		}	
	})

	return (
		
		<div className="root">
			{ redirect ?	<Redirect to="/" /> : null}
			<AppBar position="static" className="navbar">
				<Toolbar>
					<Typography variant="h6" className="nav-logo"> <Link className="link" to="/">SCHOLASTIC | </Link></Typography>
					<Typography varirant="h6" className="nav-head">The Hunger Games Quiz</Typography>
					{navLoggedIn === false?
						<Link className="link" to="/login"><Button color="inherit" className="login">Login</Button></Link>
						:
						<Typography variant="h6" className="nav-user">Welcome, {navName}</Typography>
						
					}
					{navLoggedIn? <Button className="logout-btn" onClick={handleLogoutBtn}>Logout</Button>: null}
				</Toolbar>
			</AppBar>

			<Dialog open={open} onClose={onCloseHandle} aria-labelledby="form-dialog-title"
				PaperProps={{ style: { backgroundColor: '#2d2d2d', color: '#cfcfcf', minWidth: '10%' } }}>
				<DialogTitle>Are you sure you want to logout?</DialogTitle>
				<div className="btn-div">
					<Button className="logout-btn m-right" onClick={handleLogout}>Yes</Button>
					<Button className="cancel-btn m-left" onClick={onCloseHandle}>No</Button>
				</div>
			</Dialog>
		</div>
	);
}

export default Navbar;