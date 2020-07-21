import React, { useState } from "react";
import './ProfileSection.css';
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function ProfileSection(props) {
	const [userType, setUserType] = useState(props.type);
	const profile = props.profile;

	return (
		<div className="profile-section">
			<Typography variant="h6" className="profile-param">Name: <span className="profile-data">{profile.name}</span></Typography>
			<Typography variant="h6" className="profile-param">E-mail: <span className="profile-data resp-text">{profile.email}</span></Typography>
			<Typography variant="h6" className="profile-param">Phone Number: <span className="profile-data">{profile.mobileNumber}</span></Typography>
			{userType === "user" ?
				<div>
					<Typography variant="h6" className="profile-param">Quizzes Enrolled: <span className="profile-data">{profile.quizzesEnrolled.length}</span></Typography>
					<Typography variant="h6" className="profile-param">Quizzes Completed: <span className="profile-data">{profile.quizzesGiven.length}</span></Typography>
				</div>
			: <Typography variant="h6" className="profile-param">Quizzes Created: <span className="profile-data">{profile.quizzes.length}</span></Typography> }
			<div className="m-top">
				<Button className="profile-btn update-prof-btn" component={Link} to={`/updateProfile/${userType}`}>Update Profile</Button>
				{profile.googleId === undefined ? <Button className="profile-btn" component={Link} to={`/updatePassword/${userType}`}>Update Password</Button> : null }
			</div>
		</div>
	)
}

export default ProfileSection;