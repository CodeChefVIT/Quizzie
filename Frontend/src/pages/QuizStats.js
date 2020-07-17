/* Copy of Results.js */
import React, { useState } from "react";
import "./ResultPage.css";
import { Container, Typography } from "@material-ui/core";
import Loading from "./Loading";
import { Redirect } from "react-router";
import {Pie} from "react-chartjs-2";

function QuizStats(props) {
	const [loading, setLoading] = useState(true);

	let state = null;
	const [marksPieData, setMarksPieData] = useState({labels: [], data: [], colors: []});
	
	const [redirect, setRedirect] = useState(false);

	const randomColor = () => {
		let r = Math.floor(Math.random() * 255);
		let g = Math.floor(Math.random() * 255);
		let b = Math.floor(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	const setup = () => {
		let obj = {};

		state.map((response) => {
			if(obj[response.marks] === undefined) {
				obj[response.marks] = 1;
			} else {
				obj[response.marks]++;
			}
		})

		Object.keys(obj).map((mark) => {
			let newData = marksPieData;
			newData["labels"].push(mark);
			newData["data"].push(obj[mark]);
			newData["colors"].push(randomColor());
			setMarksPieData(newData);
		})

		console.log(marksPieData);
		setLoading(false);
	}
	
	useState(() => {
		if(props.location.state === undefined) {
			setLoading(false);
			setRedirect(true);
			return;
		}

		state = props.location.state.responses;
		setup();
	}, [])

	if (loading) {
		return <Loading />
	} else if(redirect) {
		return <Redirect to="/dashboard" />
	}
	return (
		<Container className="result-page">
			<div className="result-head">
				<Typography variant="h4" className="result-title">Stats</Typography>
			</div>
			{/* <div className="quiz-stats-div">
				<Typography variant="p">Quiz</Typography>
			</div> */}
			<div className="charts-container">
				<Pie data={{
					datasets: [{data: marksPieData["data"], backgroundColor: marksPieData["colors"]}], 
					labels: marksPieData["labels"]
				}} width={300} height={300} options={{
					maintainAspectRatio: false, 
					responsive: true, 
					title: {
						display: true,
						text: "Marks Obtained",
						fontSize: 16
					}}}/>
			</div>
		</Container>
	)
}

export default QuizStats;