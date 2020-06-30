import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import ErrorPage from './pages/ErrorPage';
import AdminRegister from './pages/AdminRegister';
import InfoContext from './context/InfoContext';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import UpdateQuizDetails from './pages/updateQuizDetails';
import UpdateProfile from './pages/UpdateProfile';
import UpdatePassword from './pages/UpdatePassword';

function App() {
	const [authToken, setAuthToken] = useState(null);
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [name, changeName] = useState(null);
	const [isAdmin, setAdmin] = useState(false);
	const [testGiven, setTestGiven] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [ccStarted, setCCStarted] = useState(false);

	const [closed, setClosed] = useState(false);

	let info = {
		name: name,
		changeName: changeName,
		authToken: authToken,
		setAuthToken: setAuthToken,
		isLoggedIn: isLoggedIn,
		setLoggedIn: setLoggedIn,
		isAdmin: isAdmin,
		setAdmin: setAdmin,
		testGiven: testGiven,
		setTestGiven: setTestGiven,
		blocked: blocked,
		setBlocked: setBlocked,
		ccStarted: ccStarted,
		setCCStarted: setCCStarted,
		closed: closed,
	}

	return (
		<InfoContext.Provider value={info}>
			<Router>
				<Navbar loggedIn={info.isLoggedIn} />
				<Switch>
					<Route exact path="/">
						<Welcome />
					</Route>
					<Route exact path="/dashboard">
						<Dashboard />
					</Route>
					<Route exact path="/updateProfile/:type" component={UpdateProfile} />
					<Route exact path="/updatePassword/:type" component={UpdatePassword} />
					<Route exact path="/createQuiz">
						<CreateQuiz />
					</Route>
					<Route exact path="/editQuiz/:id" component={EditQuiz} />
					<Route exact path="/updateQuizDetails/:id" component={UpdateQuizDetails} />
					<Route exact path="/register/:type" component={RegisterPage} />
					<Route exact path="/admin">
						<Admin />
					</Route>
					<Route exact path="/quiz">
						<Quiz />
					</Route>
					<Route exact path="/adminRegister">
						<AdminRegister />
					</Route>
					<Route exact path="/login/:type" component={LoginPage} />
					<Route exact path="/forgotPassword">
						<ForgotPassword />
					</Route>
					<Route path='*'>
						<ErrorPage />
					</Route>
				</Switch>
			</Router>
		</InfoContext.Provider>
	);

}

export default App;
