import React, {useState, useContext, useEffect} from "react";
import { Container, Typography, AppBar, Tabs, Tab } from "@material-ui/core";
import "./Dashboard.css";
import "./OwnerDashboard.css";
import InfoContext from '../context/InfoContext';
import { Redirect } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import '../components/ProfileSection';


function OwnerDashboard() {
	const [tab, setTab] = useState(0);
	const [redirect, setRedirect] = useState(false);
	const [redirectOwner, setRedirectOwner] = useState(false);

	const [loading, setLoading] = useState(false);

	const [refresh, setRefresh] = useState(false);

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

	// useEffect(() => {
	// 	if(refresh === true) {
	// 		getProfile();
	// 		setRefresh(false);
	// 	}
	// }, [refresh])

	if(redirect) {
		return (
			<Redirect to="/" />
		)
	} else if(loading) {
		return (
			<Loading />
		)
	}
	else {
		return (
			<Container className="dashboard-page owner-page">
				<Typography variant="h4" className="dash-head">Owner Dashboard</Typography>
				<div className="dash-section">
					<AppBar position="static" color="default" className="bg-white tab-bar owner-tab">
						<Tabs
							value={tab}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							aria-label="full width tabs owner-dashboard"
						>
							<Tab label="All Quizzes" />
							<Tab label="All User" />
							<Tab label="All Organizer" />
						</Tabs>
					</AppBar>
					<TabPanel value={tab} index={0}>
						
					</TabPanel>
					<TabPanel value={tab} index={1}>
						
					</TabPanel>
					<TabPanel value={tab} index={2}>
						
					</TabPanel>
				</div>
			</Container>
		)
	}
}


export default OwnerDashboard;

function TabPanel(props) {
	return (
		<div
			role="tabpanel"
			hidden={props.value !== props.index}
			id={`simple-tabpanel-${props.index}`}
			aria-labelledby={`simple-tab-${props.index}`}
		>
			<div>{props.children}</div>
		</div>
	)
}