/* Copy of Results.js */
import React, { useState } from "react";
import "./ResultPage.css";
import { Container, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, List, ListItemIcon, ListItemText, ListItem, IconButton } from "@material-ui/core";
import axios from "axios";
import Loading from "./Loading";
import { Adjust, ExpandMore, Check, Close, Warning, ArrowBackIos, ArrowBack } from "@material-ui/icons";
import { Redirect } from "react-router";

function StudentResponses(props) {
	const [loading, setLoading] = useState(true);

	const [name, setName] = useState("");
	const [marks, setMarks] = useState(null);
	const [responses, setResponses] = useState([]);
	
	const [redirect, setRedirect] = useState(false);

	let state = null;

	const resIcon = (response) => {
		if(response.selected === response.correctAnswer) {
			return <Check style={{color: 'green', marginLeft: '3px'}} />
		} else if(response.selected === null) {
			return <Warning style={{color: 'goldenrod', marginLeft: '3px'}} />
		} 
		else {
			return <Close style={{color: 'red', marginLeft: '3px'}} />
		}
	}

	const setup = () => {
		setName(state.userId.name);
		setMarks(state.marks);
		setResponses(state.responses);
		setLoading(false);
	}

	
	useState(() => {
		if(props.location.state === undefined) {
			setLoading(false);
			setRedirect(true);
			return;
		}

		state = props.location.state.response;
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
				<Typography variant="h4" className="result-title">Results</Typography>
			</div>
			<div className="result-quiz-info">
				<Typography variant="h5"><span className="profile-param">Quiz:</span> <strong>{name}</strong></Typography>
				<Typography variant="h5"><span className="profile-param">Scored:</span> <strong>{marks}</strong> out of <strong>{responses.length}</strong></Typography>
			</div>
			<div className="result-responses">
				<div className="result-response-title">
					<Typography variant="h5">Responses</Typography>
				</div>
				<div className="result-responses-list">
					{responses.map((response) => (
						<ExpansionPanel elevation={3} className="expansion" key={response.quesId}>
							<ExpansionPanelSummary
								className="question-response"
								expandIcon={<ExpandMore />}
								aria-controls="question-content"
								aria-label="Expand"
							>
								<Typography className="question-label">{response.description} {resIcon(response)}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<List component="nav" className="options-display">
									{response.options.map((option) => (
										<ListItem button key={option._id}>
											<ListItemIcon><Adjust style={{ color: response.correctAnswer === option.text ? 'green' : (response.selected === option.text? 'red': 'black') }} /></ListItemIcon>
											<ListItemText style={{ color: response.correctAnswer === option.text ? 'green' : (response.selected === option.text? 'red': 'black') }} primary={option.text} />
										</ListItem>
									))}
								</List>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}
				</div>
			</div>
		</Container>
	)
}

export default StudentResponses;