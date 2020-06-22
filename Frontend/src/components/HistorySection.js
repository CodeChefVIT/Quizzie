import React from "react";
import './HistorySection.css';

function HistroySection(props) {
	const profile = props.profile;

	return (
		<div className="history-section">
			{profile.quizzesGiven.length === 0? 
				<p>You have not given any quizzes yet!</p>
			: null}
		</div>
	)
}

export default HistroySection;