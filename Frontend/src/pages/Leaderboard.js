import React from "react";
import { Typography, Container } from "@material-ui/core";
import './Leaderboard.css';
import { Grid } from "@material-ui/core";
import MaterialTable from "material-table";

function Leaderboard() {

	const columns = [
		{ field: 'name', title: 'Name'},
		{ field: 'score', title: 'Score'}
	];
	function createData(n, s) {
		return { name: n, score: s }
	}
	const [rows, setRows] = React.useState([]);

	return (
		<div className="error-section">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h3" style={{color: 'orange', marginBottom: '5%'}}>Leaderboard</Typography>
					<Typography variant="h4" style={{color: 'white'}}>Evaluating Leaderboard</Typography>
				</Grid>
				{/* <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
					<MaterialTable
						columns={columns}
						data={rows}
						style={{ width: '95%', height: '100%', backgroundColor: '#2d2d2d', color: '#cfcfcf' }}
						options={{
							headerStyle: {
								backgroundColor: 'orange'
							},
							rowStyle: {
								color: 'orange'
							},
							paging: false,
							toolbar: false,
						}}
					/>	
				</Grid> */}
			</Grid>
			
		</div>
	)
}

export default Leaderboard;