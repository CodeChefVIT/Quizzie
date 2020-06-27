import React, { useEffect } from "react";
import { Container } from "@material-ui/core";

function EditQuiz(props) {
	const quizId = props.match.params.id;

	useEffect(() => {
		console.log(props.location.prop);
	}, [])

	return (
		<Container className="edit-quiz-page">
			<h1>EditQuiz</h1>
		</Container>
	)
}

export default EditQuiz;