import React, {useState, useContext, useEffect} from "react";
import { Container, Typography, AppBar, Tabs, Tab, Snackbar } from "@material-ui/core";
import "./Dashboard.css";
import InfoContext from '../context/InfoContext';
import { Redirect } from "react-router";
import Loading from "./Loading";
import axios from "axios";
import '../components/ProfileSection';
import ProfileSection from "../components/ProfileSection";
import HistorySection from '../components/HistorySection';
import QuizzesSection from "../components/QuizzesSection";
import { Alert } from "@material-ui/lab";


function Dashboard(props) {
	const [tab, setTab] = useState(0);
	const [redirect, setRedirect] = useState(false);
	const [redirectOwner, setRedirectOwner] = useState(false);

	const [userType, setUserType] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const [refresh, setRefresh] = useState(false);

	const [blockSnack, setBlockSnack] = useState(false);
	const [timeUpSnack, setTimeUpSnack] = useState(false);
	const [emptySnack, setEmptySnack] = useState(false);

	const {isLoggedIn} = useContext(InfoContext);

	const handleTabChange = (e, newVal) => {
		setTab(newVal);
	}

	const getProfile = async () => {
		setLoading(true);
		let url = "https://quizzie-api.herokuapp.com/general/checkUser";

		let token = localStorage.getItem("authToken");

		if(token === null) {
			setRedirect(true);
			return;
		}

		let uType = null;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				let type = res.data.result.userType;
				if(type === "User")
					uType = "user";
				else if(type === "Admin")
					uType = "admin";
				else if(type === "Owner") {
					uType = "owner";
					setRedirectOwner(true);
				}
				
				setUserType(uType);
			})
		} catch(error) {
			console.log(error);
			localStorage.clear();
			setRedirect(true);
			return;
		}

		if(uType === "owner") return;

		url = `https://quizzie-api.herokuapp.com/${uType}/`;
		try {
			await axios.get(url, {
				headers: {
					"auth-token": token,
				}
			}).then(res => {
				setProfile(res.data.result1);
				setLoading(false);
			})
		} catch(error) {
			console.log(error);
			localStorage.clear();
			setRedirect(true);
			return;
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

	useEffect(() => {
		if(refresh === true) {
			getProfile();
			setRefresh(false);
		}
	}, [refresh])

	useEffect(() => {
		if(Object.keys(props).length !== 0 && props.location.state !== undefined) {
			if(props.location.state.blocked) {
				setBlockSnack(true);
			} else if(props.location.state.timeUp) {
				setTimeUpSnack(true);
			} else if(props.location.state.emptyQuiz) {
				setEmptySnack(true);
			}
		}
	}, [])

	if(redirect) {
		return (
			<Redirect to="/" />
		)
	} else if(redirectOwner) {
		return <Redirect to="/coronilOP" />
	} else if(loading) {
		return (
			<Loading />
		)
	}
	else {
		return (
			<Container className="dashboard-page">
				<Typography variant="h4" className="dash-head">{userType === "user"? "Dashboard": "Organizer's Dashboard"}</Typography>
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
							<Tab label={userType === "admin"? "Your Quizzes": "History"} />
							<Tab label="Profile" />
						</Tabs>
					</AppBar>
					<TabPanel value={tab} index={0}>
						<QuizzesSection type={userType} profile={profile} refresh={setRefresh}/>
					</TabPanel>
					<TabPanel value={tab} index={1}>
						<HistorySection profile={profile} type={userType}/>
					</TabPanel>
					<TabPanel value={tab} index={2}>
						<ProfileSection profile={profile} type={userType}/>
					</TabPanel>
				</div>
				<Snackbar open={blockSnack} autoHideDuration={5000} onClose={() => setBlockSnack(false)}>
					<Alert variant="filled" severity="error" onClose={() => setBlockSnack(false)}>You violated the quiz rules!</Alert>
				</Snackbar>
				<Snackbar open={timeUpSnack} autoHideDuration={5000} onClose={() => setTimeUpSnack(false)}>
					<Alert variant="filled" severity="error" onClose={() => setTimeUpSnack(false)}>Time's Up! Your quiz was not submitted!</Alert>
				</Snackbar>
				<Snackbar open={emptySnack} autoHideDuration={5000} onClose={() => setEmptySnack(false)}>
					<Alert variant="filled" severity="error" onClose={() => setEmptySnack(false)}>There are no questions in the quiz.</Alert>
				</Snackbar>
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