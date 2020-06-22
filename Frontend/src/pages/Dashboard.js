import React, {useState, useContext, useEffect} from "react";
import { Container, Typography, AppBar, Tabs, Tab } from "@material-ui/core";
import "./Dashboard.css";
import InfoContext from '../context/InfoContext';
import { Redirect } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import '../components/ProfileSection';
import ProfileSection from "../components/ProfileSection";
import HistorySection from '../components/HistorySection';
import QuizzesSection from "../components/QuizzesSection";


function Dashboard() {
	const [tab, setTab] = useState(0);
	const [redirect, setRedirect] = useState(false);

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const {isLoggedIn} = useContext(InfoContext);

	const handleTabChange = (e, newVal) => {
		setTab(newVal);
	}

	const getProfile = async () => {
		let url = "https://quizzie-api.herokuapp.com/user/";
		let token = localStorage.getItem("authToken");

		if(token === null) {
			setRedirect(true);
			return;
		}

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				console.log(res);
				setProfile(res.data.result1);
			})

			setLoading(false);
		} catch(error) {
			console.log(error);
			setRedirect(true);
		}
	}

	useEffect(() => {
		if(!isLoggedIn) {
			setRedirect(true);
			return;
		} else {
			getProfile();
		}
	}, [])

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
			<Container className="dashboard-page">
				<Typography variant="h4" className="dash-head">Dashboard</Typography>
				<div className="dash-section">
					<AppBar position="static" color="default" className="bg-white tab-bar">
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
						<QuizzesSection />
					</TabPanel>
					<TabPanel value={tab} index={1}>
						<HistorySection profile={profile} />
					</TabPanel>
					<TabPanel value={tab} index={2}>
						<ProfileSection profile={profile}/>
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
			<div>{props.children}</div>
		</div>
	)
}

export default Dashboard;