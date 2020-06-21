import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import QuizCC from './pages/QuizCC';
import ErrorPage from './pages/ErrorPage';
import Leaderboard from './pages/Leaderboard';
import AdminRegister from './pages/AdminRegister';
import InfoContext from './context/InfoContext';
import ForgotPassword from './pages/ForgotPassword';
import MarksPage from './pages/MarksPage';

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
					<Route exact path="/register">
						<RegisterPage />
					</Route>
					<Route exact path="/admin">
						<Admin />
					</Route>
					<Route exact path="/quiz">
						<Quiz />
					</Route>
					<Route exact path="/ccquiz">
						<QuizCC />
					</Route>
					<Route exact path="/marks">
						<MarksPage />
					</Route>
					<Route exact path="/adminRegister">
						<AdminRegister />
					</Route>
					<Route exact path="/login">
						<LoginPage />
					</Route>
					<Route exact path="/forgotPassword">
						<ForgotPassword />
					</Route>
					<Route exact path="/leaderboard">
						<Leaderboard />
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
