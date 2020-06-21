import React, { useEffect, useState } from "react";
import { Container, Typography } from "@material-ui/core";
import { Redirect } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import "./MarksPage.css"

function MarksPage(props) {
	const [loading, setLoading] = useState(true);
	const [marks, setMarks] = useState(null);
	const [CCmarks, setCCMarks] = useState(null);

	const [redirect, setRedirect] = useState(false);

	const getData = async () => {
		let token = localStorage.getItem('authToken');
		let url = `https://scholastic-quiz-app.herokuapp.com/checkAuth`;

		if (token === null) {
			setRedirect(true);
			return;
		}

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				if (res.data.testGiven === false) {
					setRedirect(true);
					return;
				}
				else {
					setMarks(res.data.score);
					setCCMarks(res.data.scoreCC);
				}
			})
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}


	useEffect(() => {
		getData();
	}, [])

	if (redirect) {
		return (
			<Redirect to="/"></Redirect>
		)
	}
	else if (loading) {
		return (
			<Loading />
		)
	}
	else {
		return (
			<div className="marks-page">
				<Container>
					<Typography variant="h2" className="congo">You have successfully submitted the quiz</Typography><br />
					<Typography variant="h2" className="congo">You Scored</Typography>
					<Typography varaint="h2" className="marks">Hunger games: <p className="value">{marks}</p></Typography>
					<Typography varaint="h2" className="marks">Competitive coding: <p className="value">{CCmarks}</p></Typography>
				</Container>
			</div>
		)
	}
}

export default MarksPage;