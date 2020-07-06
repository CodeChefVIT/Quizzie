import React, { useState, useEffect } from "react";
import axios from "axios";

function OwnerUsers() {
	const [organizers, setOrganizers] = useState([]);

	const getUsers = async () => {
		let token = localStorage.getItem("authToken");
		let url = `https://quizzie-api.herokuapp.com/owner/allAdmins`;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				setOrganizers(res.data.result);
			})
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getUsers();
	}, [])

	return (
		organizers.map((user) => (
			<h5>{user.name}</h5>
		))
	)

}

export default OwnerUsers;