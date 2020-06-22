import React, {useState, useContext, useEffect} from "react";
import { Container, Typography, AppBar, Tabs, Tab } from "@material-ui/core";
import "./Dashboard.css";
import InfoContext from '../context/InfoContext';
import { Redirect } from "react-router";


function Dashboard() {
	const [tab, setTab] = useState(0);
	const [redirect, setRedirect] = useState(false);
	const {isLoggedIn} = useContext(InfoContext);

	const handleTabChange = (e, newVal) => {
		setTab(newVal);
	}

	useEffect(() => {
		if(!isLoggedIn) {
			setRedirect(true);
			return;
		}
	}, [])

	if(redirect) {
		return (
			<Redirect to="/" />
		)
	}
	else {
		return (
			<Container className="dashboard-page">
				<Typography variant="h4" className="dash-head">Dashboard</Typography>
				<div className="dash-section">
					<AppBar position="static" color="default" className="bg-white">
						<Tabs
							value={tab}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							aria-label="full width tabs dashboard"
						>
							<Tab label="Quizzes" />
							<Tab label="History" />
							<Tab label="Profile" />
						</Tabs>
					</AppBar>
					<TabPanel value={tab} index={0}>
						Item One
					</TabPanel>
					<TabPanel value={tab} index={1}>
						Item Two
					</TabPanel>
					<TabPanel value={tab} index={2}>
						Item Three
					</TabPanel>
				</div>
			</Container>
		)
	}
}

function TabPanel(props) {
	return (
		<div
			role="tabpanel"
			hidden={props.value !== props.index}
			id={`simple-tabpanel-${props.index}`}
			  aria-labelledby={`simple-tab-${props.index}`}
		>
			<p>{props.children}</p>
		</div>
	)
}

export default Dashboard;