/* Copy of Results.js */
import React, { useState } from "react";
import "./ResultPage.css";
import { Container, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItemIcon, ListItemText, ListItem, IconButton } from "@material-ui/core";
import axios from "axios";
import Loading from "./Loading";
import { Adjust, ExpandMore, Check, Close, Warning } from "@material-ui/icons";
import { Redirect } from "react-router";

function QuizStats(props) {
	const [loading, setLoading] = useState(false);

	const [state, setState] = useState(null);
	const [responses, setResponses] = useState([]);
	
	const [redirect, setRedirect] = useState(false);
	
	useState(() => {
		if(props.location.state === undefined) {
			setLoading(false);
			setRedirect(true);
			return;
		}

		setState(props.location.state.responses);
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
			<div className="quiz-stats-div">
				<Typography variant="p">{JSON.stringify(state)}</Typography>
			</div>
		</Container>
	)
}

export default QuizStats;