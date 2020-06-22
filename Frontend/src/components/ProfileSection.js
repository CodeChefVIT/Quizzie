import React from "react";
import './ProfileSection.css';
import { Typography } from "@material-ui/core";

function ProfileSection(props) {
	const profile = props.profile;

	return (
		<div class="profile-section">
			<Typography variant="h5" className="profile-param">NAME: <span className="profile-data">{profile.name}</span></Typography>
			<Typography variant="h5" className="profile-param">E-MAIL: <span className="profile-data">{profile.email}</span></Typography>
			<Typography variant="h5" className="profile-param">QUIZZED ENROLLED: <span className="profile-data">{profile.quizzesEnrolled.length}</span></Typography>
			<Typography variant="h5" className="profile-param">QUIZZED COMPLETED: <span className="profile-data">{profile.quizzesGiven.length}</span></Typography>
		</div>
	)
}

export default ProfileSection;