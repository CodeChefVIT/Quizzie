import React, {useContext, useEffect, useState} from 'react';
import {Container, Grid, Hidden} from '@material-ui/core';
import './Welcome.css';
import PlayMenuBar from '../components/PlayMenuBar';
import InfoContext from "../context/InfoContext";
import axios from "axios";
import Loading from "./Loading";

function Welcome() {
	const [loading, setLoading] = useState(true);
	const {setLoggedIn, changeName, setAdmin, setTestGiven, setBlocked, setCCStarted} = useContext(InfoContext);

	const authenticate = async () => {
		let token = localStorage.getItem('authToken');
		let url = `https://scholastic-quiz-app.herokuapp.com/checkAuth`;
		let response = null;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			})
			changeName(response.data.name);
			setAdmin(response.data.isAdmin);
			setTestGiven(response.data.testGiven);
			setBlocked(response.data.isBlocked);
			setCCStarted(response.data.ccStarted);
			setLoggedIn(true);
		} catch(error) {
			localStorage.clear()
			setLoggedIn(false);
		}
		setLoading(false);
	}

	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if(token === null) {
			setLoggedIn(false);
			setLoading(false);
		} else {
			authenticate();
		}
	}, []);

	return (
		loading ? <Loading />
		:
		<Container className="welcome-page">
			<div className="welcome-screen">
				<Grid container spacing={0}>
					<Grid item xs={12} md={6} className="heading-section">
						<img src="head.png" className="quiz-image" alt="Welcome to Hunger Games"></img>
					</Grid>
					<Hidden smDown>
						<Grid item xs={12} md={6} className="pin-section">
							<img src="hg-pin.png" className="pin-image" alt="Mockingjay Pin"></img>
						</Grid>
					</Hidden>
				</Grid>
				<PlayMenuBar />
			</div>
		</Container>
	)
}

export default Welcome;