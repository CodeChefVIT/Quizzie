import React, { useState, useEffect, Suspense } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import InfoContext from "./context/InfoContext";

const Welcome = React.lazy(() => import("./pages/Welcome"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const Quiz = React.lazy(() => import("./pages/Quiz"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CreateQuiz = React.lazy(() => import("./pages/CreateQuiz"));
const EditQuiz = React.lazy(() => import("./pages/EditQuiz"));
const UpdateQuizDetails = React.lazy(() => import("./pages/updateQuizDetails"));
const UpdateProfile = React.lazy(() => import("./pages/UpdateProfile"));
const UpdatePassword = React.lazy(() => import("./pages/UpdatePassword"));
const OwnerDashboard = React.lazy(() => import("./pages/OwnerDashboard"));
const OwnerQuizDetails = React.lazy(() => import("./pages/OwnerQuizDetails"));
const ResultPage = React.lazy(() => import("./pages/ResultPage"));
const StudentResponses = React.lazy(() => import("./pages/StudentResponses"));
const VerifyMail = React.lazy(() => import("./pages/VerifyMail"));
const QuizStats = React.lazy(() => import("./pages/QuizStats"));
/**
 * Render function
 */
function Renderer({ component }) {
  return (
    <Suspense fallback={<></>}>
      <>{component}</>
    </Suspense>
  );
}
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
          <Route exact path="/">
            <Renderer component={<Welcome />} />
          </Route>
          <Route exact path="/dashboard">
            <Renderer component={<Dashboard />} />
          </Route>
          <Route exact path="/coronilOP">
            <Renderer component={<OwnerDashboard />} />
          </Route>
          <Route exact path="/ownerQuizDetails/:id">
            <Renderer component={<OwnerQuizDetails />} />
          </Route>
          <Route exact path="/results/:id">
            <Renderer component={<ResultPage />} />
          </Route>
          <Route exact path="/updateProfile/:type">
            <Renderer component={<UpdateProfile />} />
          </Route>
          <Route exact path="/updatePassword/:type">
            <Renderer component={<UpdatePassword />} />
          </Route>
          <Route exact path="/createQuiz">
            <Renderer component={<CreateQuiz />} />
          </Route>
          <Route exact path="/editQuiz/:id">
            <Renderer component={<EditQuiz />} />
          </Route>
          <Route exact path="/quizStats">
            <Renderer component={<QuizStats />} />
          </Route>
          <Route exact path="/studentResponse">
            <Renderer component={<StudentResponses />} />
          </Route>
          <Route exact path="/updateQuizDetails/:id">
            <Renderer component={<UpdateQuizDetails />} />
          </Route>
          <Route exact path="/register/:type">
            <Renderer component={<RegisterPage />} />
          </Route>
          <Route exact path="/verify/:type">
            <Renderer component={<VerifyMail />} />
          </Route>

          <Route exact path="/quiz/">
            <Renderer component={<Quiz />} />
          </Route>
          <Route exact path="/login/:type">
            <Renderer component={<LoginPage />} />
          </Route>
          <Route exact path="/forgotPassword/:type">
            <Renderer component={<ForgotPassword />} />
          </Route>

          <Route path="*">
            <ErrorPage />
          </Route>
        </Switch>
      </Router>
    </InfoContext.Provider>
  );
}

export default App;
