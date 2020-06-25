import React, { useState } from "react";
import './ProfileSection.css';
import { Typography } from "@material-ui/core";

function ProfileSection(props) {
	const [userType, setUserType] = useState(props.type);
	const profile = props.profile;

	return (
		<div className="profile-section">
			<Typography variant="h6" className="profile-param">Name: <span className="profile-data">{profile.name}</span></Typography>
			<Typography variant="h6" className="profile-param">E-mail: <span className="profile-data">{profile.email}</span></Typography>
			<Typography variant="h6" className="profile-param">Phone Number: <span className="profile-data">{profile.mobileNumber}</span></Typography>
			{userType === "user" ?
				<div>
					<Typography variant="h6" className="profile-param">Quizzes Enrolled: <span className="profile-data">{profile.quizzesEnrolled.length}</span></Typography>
					<Typography variant="h6" className="profile-param">Quizzes Completed: <span className="profile-data">{profile.quizzesGiven.length}</span></Typography>
				</div>
			: <Typography variant="h6" className="profile-param">Quizzes Created: <span className="profile-data">{profile.quizzes.length}</span></Typography> }
		</div>
	)
}

export default ProfileSection;