import React, { useState, useEffect } from "react";
import axios from "axios";
import './OwnerQuizzes.css';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";


function OwnerUsers() {
	const [users, setUsers] = useState([]);

	const getUsers = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/owner/allUsers`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				setUsers(res.data.result);
			})
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getUsers();
	}, [])

	return (
		<div className="owner-quizzes">
			<List aria-label="users-display" className="owner-quiz-list">
				{users.map((user) => (
					<ListItem button key={user._id}>
						<ListItemText primary={user.email} secondary={user.name} />
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="details">
								<ArrowForwardIos />
							</IconButton>
					</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</div>
	)

}

export default OwnerUsers;