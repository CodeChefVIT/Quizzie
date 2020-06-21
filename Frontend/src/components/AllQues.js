import React from 'react';
import MaterialTable from "material-table";
import {Alert} from "@material-ui/lab";
import Loading from "../pages/Loading";
import axios from "axios";
import {Grid} from "@material-ui/core";

export default function AllQues(){

	const [alert, setAlert] = React.useState(false);
	const [alertText, setAlertText] = React.useState('');
	const [loading, setLoading] = React.useState(true);
	const columns = [
		{ field: 'qid', title: 'Q_ID', minwidth: 10, editable: 'never' },
		{ field: 'ques', title: 'Question', minWidth: 200 }, { field: 'op1', title: 'Option1', minWidth: 50 },
		{ field: 'op2', title: 'Option2', minWidth: 50 }, { field: 'op3', title: 'Option3', minWidth: 50 },
		{ field: 'op4', title: 'Option4', minWidth: 50 }, { field: 'correct', title: 'Correct Option', minWidth: 50 },
	];
	function createData(id, q, o1, o2, o3, o4, c) {
		return { qid: id, ques: q, op1: o1, op2: o2, op3: o3, op4: o4, correct: c }
	}
	const [rows, setRows] = React.useState([]);

	const update = async(ndata, odata) => {
		if(ndata.qid === odata.qid){
			let error = false;
			if(ndata.ques.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.op1.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.op2.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.op3.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.op4.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.correct.length === 0){
				error = true;
				setAlert(true);
				setAlertText('Fields cannot be empty');
			}
			if(ndata.op1 === ndata.op2 || ndata.op1=== ndata.op3 || ndata.op1 === ndata.op4 || ndata.op2 === ndata.op3 || ndata.op2 === ndata.op4 || ndata.op3 === ndata.op4){
				error = true;
				setAlert(true);
				setAlertText('Options cannot be repeated');
			}
			if(!(ndata.correct === ndata.op1 || ndata.correct === ndata.op2 || ndata.correct === ndata.op3 || ndata.correct === ndata.op4)){
				error = true;
				setAlert(true);
				setAlertText('Correct option must be from provided options');
			}
			if(!error){
				let token = localStorage.getItem('authToken');
				let url = `https://scholastic-quiz-app.herokuapp.com/questions/${ndata.qid}`
				let data = {
					"description" : ndata.ques,
					"correct_answer" : ndata.correct,
					"alternatives" : [
						{
							"text" : ndata.op1
						},
						{
							"text" : ndata.op2
						},
						{
							"text" : ndata.op3
						},
						{
							"text" : ndata.op4
						}
					] 
				}
				let response = null;
				try {
					await axios.put(url,data,{
						headers: {
							"auth-token" : token
						}}).then(res => {
						response = res;
					});
					if(response.status === 200) {
						getAll();
					}
				} catch(error) {
					console.log(error);
				}
			}
			else{
				setTimeout(() => {
					setAlert(false);
					setAlertText('');
				}, 5000);
			}
		}
	}

	const del = async(data) => {
		let token = localStorage.getItem('authToken');
		let url = `https://scholastic-quiz-app.herokuapp.com/questions/${data.qid}`;
		let response = null;

		try {
			await axios.delete(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			});
			if(response.status === 204){
				getAll();
			}

		} catch(error) {
			console.log(error);
		}
		setLoading(false);
		getAll();
	}
    
	const getAll = async() => {
		let token = localStorage.getItem('authToken');
		let url = `https://scholastic-quiz-app.herokuapp.com/questions`;
		let response = null;
		let i = 0;
		let data = [];
		setRows(null);
		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			});
			if(response.status === 200){
				for(i = 0; i < response.data.length; i++){
					var id = response.data[i]._id;
					var ques = response.data[i].description;
					var correct = response.data[i].correct_answer;
					var o1 = response.data[i].alternatives[0].text;
					var o2 = response.data[i].alternatives[1].text;
					var o3 = response.data[i].alternatives[2].text;
					var o4 = response.data[i].alternatives[3].text;
					
					data = [...data, createData(id,ques,o1,o2,o3,o4,correct)]
				}
				setRows(data);
			}

		} catch(error) {
			console.log(error);
		}
		setLoading(false);
	}

    React.useEffect(() => {
		getAll();
    }, []);

    return(
        loading? <Loading />
        :
        <Grid container spacing={3} style={{display:'flex', justifyContent: 'center', maxWidth: '100%'}}>
			<Grid item xs={12} style={{display: 'flex', justifyContent: 'center', marginLeft: 25}}>
			<MaterialTable
			 title="Questions List"
			 columns={columns}
			 data = {rows}
			 style={{width:'98%', backgroundColor: '#2d2d2d', color: '#cfcfcf'}}
			 options={{
				 headerStyle: {
					backgroundColor: '#1e1e1e'
				 },
				 rowStyle: {
					 color: '#ccc'
				 }
			 }}
			 editable={{
				onRowUpdate: (newData, oldData) =>
				  new Promise((resolve) => {
					setTimeout(() => {
					  resolve();
					  update(newData, oldData);
					}, 600);
				  }),
				onRowDelete: (oldData) =>
				  new Promise((resolve) => {
					setTimeout(() => {
					  resolve();
					  del(oldData);
					}, 600);
				  }),
			  }}
			 />	
			</Grid>
            
			<Grid item xs={10}>
				{alert === true? <Alert severity="error">{alertText}</Alert>: null}
			</Grid>
		</Grid>
    )
}