import React, { useState, useEffect } from "react";
import axios from "axios";

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
		users.map((user) => (
			<h5>{user.name}</h5>
		))
	)

}

export default OwnerUsers;