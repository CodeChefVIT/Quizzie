import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Quiz from "./pages/Quiz";
import ErrorPage from "./pages/ErrorPage";
import InfoContext from "./context/InfoContext";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import UpdateQuizDetails from "./pages/updateQuizDetails";
import UpdateProfile from "./pages/UpdateProfile";
import UpdatePassword from "./pages/UpdatePassword";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerQuizDetails from "./pages/OwnerQuizDetails";
import ResultPage from "./pages/ResultPage";
import StudentResponses from "./pages/StudentResponses";
import VerifyMail from "./pages/VerifyMail";
import QuizStats from "./pages/QuizStats";

function App() {
	const [authToken, setAuthToken] = useState(null);
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [name, changeName] = useState(null);
	const [isAdmin, setAdmin] = useState(false);

	let info = {
		name: name,
		changeName: changeName,
		authToken: authToken,
		setAuthToken: setAuthToken,
		isLoggedIn: isLoggedIn,
		setLoggedIn: setLoggedIn,
		isAdmin: isAdmin,
		setAdmin: setAdmin,
	};

	return (
		<InfoContext.Provider value={info}>
			<Router>
				<Navbar loggedIn={info.isLoggedIn} />
				<Switch>
					<Route exact path="/" component={Welcome} />
					<Route exact path="/dashboard" component={Dashboard} />
					<Route exact path="/coronilOP" component={OwnerDashboard} />
					<Route
						exact
						path="/ownerQuizDetails/:id"
						component={OwnerQuizDetails}
					/>
					<Route exact path="/results/:id" component={ResultPage} />
					<Route
						exact
						path="/updateProfile/:type"
						component={UpdateProfile}
					/>
					<Route
						exact
						path="/updatePassword/:type"
						component={UpdatePassword}
					/>
					<Route exact path="/createQuiz">
						<CreateQuiz />
					</Route>
					<Route exact path="/editQuiz/:id" component={EditQuiz} />
					<Route exact path="/quizStats" component={QuizStats} />
					<Route
						exact
						path="/studentResponse"
						component={StudentResponses}
					/>
					<Route
						exact
						path="/updateQuizDetails/:id"
						component={UpdateQuizDetails}
					/>
					<Route
						exact
						path="/register/:type"
						component={RegisterPage}
					/>
					<Route exact path="/verify/:type" component={VerifyMail} />
					<Route exact path="/quiz/" component={Quiz} />
					<Route exact path="/login/:type" component={LoginPage} />
					<Route
						exact
						path="/forgotPassword/:type"
						component={ForgotPassword}
					/>
					<Route path="*">
						<ErrorPage />
					</Route>
				</Switch>
			</Router>
		</InfoContext.Provider>
	);
}

export default App;
