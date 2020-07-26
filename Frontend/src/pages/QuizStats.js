/* Copy of Results.js */
import React, { useState } from "react";
import "./ResultPage.css";
import { Container, Typography, Grid } from "@material-ui/core";
import Loading from "./Loading";
import { Redirect } from "react-router";
import {Pie, Bar, Line} from "react-chartjs-2";

function QuizStats(props) {
	const [loading, setLoading] = useState(true);

	let state = null;
	const [marksPieData, setMarksPieData] = useState({labels: [], data: [], colors: []});
	const [highLowGraph, setHighLowData] = useState({highest: -1, lowest: -1, average: -1});
	const [lineGraphData, setLineData] = useState({labels: [], data: []});
	
	const [redirect, setRedirect] = useState(false);

	const randomColor = () => {
		let r = Math.floor(Math.random() * 255);
		let g = Math.floor(Math.random() * 255);
		let b = Math.floor(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	const setup = () => {
		let obj = {};
		let obj2 = {labels: [], data: []};

		let highest = -1;
		let lowest = Infinity;
		let sum = 0;

		state.map((response) => {
			highest = Math.max(highest, response.marks);
			lowest = Math.min(lowest, response.marks);
			sum += response.marks;
			if(obj[response.marks] === undefined) {
				obj[response.marks] = 1;
			} else {
				obj[response.marks]++;
			}
			
			let time = (response.timeEnded-response.timeStarted)/(1000*60);

			obj2["labels"].push(response.userId.name);
			obj2["data"].push(time);
		})

		Object.keys(obj).map((mark) => {
			let newData = marksPieData;
			newData["labels"].push(mark);
			newData["data"].push(obj[mark]);
			newData["colors"].push(randomColor());
			setMarksPieData(newData);
		})

		let average = sum/state.length;
		let newBarData = highLowGraph;
		newBarData["highest"] = highest;
		newBarData["average"] = average;
		newBarData["lowest"] = lowest;
		setHighLowData(newBarData);
		setLineData(obj2);

		setLoading(false);
	}
	
	useState(() => {
		if(props.location.state === undefined) {
			setLoading(false);
			setRedirect(true);
			return;
		}

		state = props.location.state.responses;
		console.log(state);
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
			<div className="charts-container" style={{paddingBottom: '3%'}}>
				<div className="pie-chart" style={{marginBottom: '3%'}}>
					<Pie data={{
						datasets: [{data: marksPieData["data"], backgroundColor: marksPieData["colors"]}], 
						labels: marksPieData["labels"]
					}} 
					width={300} height={300} 
					options={{
						maintainAspectRatio: false, 
						responsive: true, 
						title: {
							display: true,
							text: "Marks Obtained",
							fontSize: 16
						}}}/>
				</div>
				<Grid container spacing={0}>
					<Grid item xs={12} sm={6}>
						<Bar width={300} height={300}
							data={{
								datasets: [{
									data: [highLowGraph["highest"], highLowGraph["average"], highLowGraph["lowest"]],
									backgroundColor: ["green", "yellow", "red"],
									barThickness: 70
								}],
								labels: ["Highest", "Average", "Lowest"]
							}}
							options={{
								legend: {display: false},
								maintainAspectRatio: false,
								title: {
									display: true,
									text: "Highest/Average/Lowest",
									fontSize: 16
								},
								scales: { yAxes: [{ticks: {beginAtZero: true}}]}
							}} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<Line width={300} height={300}
							data={{
								datasets: [{
									data: lineGraphData["data"],
									backgroundColor: "rgba(255, 0, 255, 0.3)",
									borderColor: "rgb(255, 0, 255)"
								}],
								labels: lineGraphData["labels"]
							}}

							options={{
								maintainAspectRatio: false,
								title: {
									display: true,
									text: "Time taken (in minutes)",
									fontSize: 16
								},
								legend: {display: false}
							}} />
					</Grid>
				</Grid>
			</div>
		</Container>
	)
}

export default QuizStats;