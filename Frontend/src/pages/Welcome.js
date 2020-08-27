import React, {useContext, useEffect, useState} from 'react';
import {Container, Grid, Hidden} from '@material-ui/core';
import './Welcome.css';
import PlayMenuBar from '../components/PlayMenuBar';
import InfoContext from "../context/InfoContext";
import axios from "axios";
import Loading from "./Loading";
import { Redirect } from 'react-router';
import * as qs from "query-string";

function Welcome(props) {
	const [loading, setLoading] = useState(true);
	const [dashRedirect, setDashRedirect] = useState(false);
	const { setLoggedIn, setAuthToken, changeName } = useContext(InfoContext);

	const getQueryParams = () => {
		const query = window.location.search.substring(1);
		const vars = query.split("&");

		let name = null;
		let token = null;

		vars.map(det => {
			const sp = det.split("=");
			if(sp[0] === "name") {
				name = decodeURIComponent(sp[1]);
			} else if(sp[0] === "token") {
				token = sp[1];
			}
		})

		if(name !== null && token !== null) {
			setAuthToken(token);
			changeName(name);

			localStorage.setItem("authToken", token);
			localStorage.setItem("name", name);
			localStorage.setItem("userLoggedIn", true);
			setLoggedIn(true);

			setDashRedirect(true);
			return true;
		}

		return false;
	}

	useEffect(() => {
		if(!getQueryParams()) {
			const token = localStorage.getItem('authToken');
			if(token === null) {
				setLoggedIn(false);
				setLoading(false);
			} else {
				setLoggedIn(true);
				setDashRedirect(true);
				setLoading(false);
			}
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