import React from "react";
import './ProfileSection.css';
import { Typography } from "@material-ui/core";

function ProfileSection(props) {
	const profile = props.profile;

	return (
		<div class="profile-section">
			<Typography variant="h5" className="profile-param">Name: <span className="profile-data">{profile.name}</span></Typography>
			<Typography variant="h5" className="profile-param">E-mail: <span className="profile-data">{profile.email}</span></Typography>
			<Typography variant="h5" className="profile-param">Phone Number: <span className="profile-data">{profile.mobileNumber}</span></Typography>
			<Typography variant="h5" className="profile-param">Quizzes Enrolled: <span className="profile-data">{profile.quizzesEnrolled.length}</span></Typography>
			<Typography variant="h5" className="profile-param">Quizzes Completed: <span className="profile-data">{profile.quizzesGiven.length}</span></Typography>
		</div>
	)
}

export default ProfileSection;