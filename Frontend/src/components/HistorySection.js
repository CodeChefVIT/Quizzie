import React, { useState } from "react";
import './HistorySection.css';

function HistorySection(props) {
	const [userType, setUserType] = useState(props.type);
	const profile = props.profile;

	if(userType === "admin") {
		return (
			<div className="history-section">
				{profile.quizzes.length === 0? 
					<p>You have not created any quizzes yet!</p>
				: null}
			</div>
		)
	}
	else {
		return (
			<div className="history-section">
				{profile.quizzesGiven.length === 0? 
					<p>You have not given any quizzes yet!</p>
				: null}
			</div>
		)
	}
}

export default HistorySection;