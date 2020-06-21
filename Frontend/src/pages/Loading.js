import React from "react";
import {CircularProgress} from "@material-ui/core";
import './Loading.css';

function Loading() {
	return (
		<div className="loading-screen">
			<CircularProgress color="secondary" />
		</div>
	);
}

export default Loading;