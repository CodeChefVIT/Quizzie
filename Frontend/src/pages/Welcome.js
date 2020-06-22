import React, {useContext, useEffect, useState} from 'react';
import {Container, Grid, Hidden} from '@material-ui/core';
import './Welcome.css';
import PlayMenuBar from '../components/PlayMenuBar';
import InfoContext from "../context/InfoContext";
import axios from "axios";
import Loading from "./Loading";
import { Redirect } from 'react-router';

function Welcome() {
	const [loading, setLoading] = useState(true);
	const [dashRedirect, setDashRedirect] = useState(false);
	const { setLoggedIn } = useContext(InfoContext);


	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if(token === null) {
			setLoggedIn(false);
			setLoading(false);
		} else {
			setLoggedIn(true);
			setDashRedirect(true);
			setLoading(false);
		}
	}, []);

	if(dashRedirect) {
		return (
			<Redirect to="/dashboard" />
		)
	} else {
		return (
			loading ? <Loading />
			:
			<Container className="welcome-page">
				<div className="welcome-screen">
					<Grid container spacing={0}>
						<Grid item xs={12} md={6} className="heading-section">
							<img src="head.png" className="quiz-image" alt="Welcome to Quizzie"></img>
						</Grid>
						<Hidden smDown>
							<Grid item xs={12} md={6} className="pin-section">
								<img src="quiz.png" className="pin-image" alt="User Representation"></img>
							</Grid>
						</Hidden>
					</Grid>
					<PlayMenuBar />
				</div>
			</Container>
		)
	}
}

export default Welcome;