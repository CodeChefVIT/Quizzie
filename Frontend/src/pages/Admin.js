import React, {useEffect } from 'react';
import './Admin.css';
import {
	Button, Dialog, DialogActions,
	DialogContent, DialogTitle, 
	Radio, RadioGroup,
	FormControlLabel, FormControl,
	FormLabel, Grid
} from '@material-ui/core';
import TextInput from "../components/TextInput";
import SubTable from "../components/SubTable";
import AllQues from "../components/AllQues";
import Loading from "./Loading";
import axios from "axios";
import { Redirect } from 'react-router';

function Admin() {
	const [open, setOpen] = React.useState(false);
	const [openSub, setOpenSub] = React.useState(false);
	const [openAdd, setOpenAdd] = React.useState(false);
	const [value, setValue] = React.useState('none');

	const [isAdmin, setAdmin] = React.useState(true);
	const [loading, setLoading] = React.useState(true);

	const [valueError, setValueError] = React.useState('');
	const [ques, setQues] = React.useState('');
	const [quesError, setQuesError] = React.useState('');
	const [op1, setOp1] = React.useState('');
	const [op1Error, setOp1Error] = React.useState('');
	const [op2, setOp2] = React.useState('');
	const [op2Error, setOp2Error] = React.useState('');
	const [op3, setOp3] = React.useState('');
	const [op3Error, setOp3Error] = React.useState('');
	const [op4, setOp4] = React.useState('');
	const [op4Error, setOp4Error] = React.useState('');
	const [submitResponse, setSubmit] = React.useState('');
	


	const errorText = "This field cannot be empty";

	const checkAdmin = async () => {
		let token = localStorage.getItem('authToken');

		if(token == null) {
			setAdmin(false);
			setLoading(false);
			return;
		}
		let url = `https://scholastic-quiz-app.herokuapp.com/checkAuth`;
		let response = null;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			});

			setAdmin(response.data.isAdmin);
		} catch(error) {
			console.log(error);
			setAdmin(false);
		}

		setLoading(false);
	}

	useEffect(() => {
		checkAdmin();
	}, [])

	const handleChange = (event) => {
		setValue(event.target.value);
		setValueError('');
	};
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClickOpenSub = () => {
		setOpenSub(true);
	};
	const handleClickOpenAdd = () => {
		setOpenAdd(true);
	};
	const handleClose = () => {
		setOpen(false);
		setOpenSub(false);
		setOpenAdd(false);
	};

	const handleQchange = (event) => {
		var s = event.target.value;
		setQues(s);
		if(s.length === 0){
			setQuesError(errorText);
		}else{
			setQuesError('');
		}
	};
	const handle1change = (event) => {
		var s = event.target.value;
		setOp1(s);
		if(s.length === 0){
			setOp1Error(errorText);
		}else{
			setOp1Error('');
		}
	};
	const handle2change = (event) => {
		var s = event.target.value;
		setOp2(s);
		if(s.length === 0){
			setOp2Error(errorText);
		}else{
			setOp2Error('');
		}
	};
	const handle3change = (event) => {
		var s = event.target.value;
		setOp3(s);
		if(s.length === 0){
			setOp3Error(errorText);
		}else{
			setOp3Error('');
		}
	};
	const handle4change = (event) => {
		var s = event.target.value;
		setOp4(s);
		if(s.length === 0){
			setOp4Error(errorText);
		}else{
			setOp4Error('');
		}
	};

	const handleSubmit = async() => {
		let error = false;
		let val = "none";
		if(ques.length === 0){
			setQuesError(errorText);
			error = true;
		}
		if(op1.length === 0){
			setOp1Error(errorText);
			error = true;
		}
		if(op2.length === 0){
			setOp2Error(errorText);
			error = true;
		}
		if(op3.length === 0){
			setOp3Error(errorText);
			error = true;
		}
		if(op4.length === 0){
			setOp4Error(errorText);
			error = true;
		}
		if(op1 === op2 || op1=== op3 || op1 === op4 || op2 === op3 || op2 === op4 || op3 === op4){
			setValueError('Multiple same options');
			error = true;
		}
		if(value === 'none'){
			setValueError(errorText);
			error = true;
		}else if(value === 'op1'){
			val = op1;
		}else if(value === 'op2'){
			val = op2;
		}else if(value === 'op3'){
			val = op3;
		}else if(value === 'op4'){
			val = op4;
		}
		if(!error){
				let token = localStorage.getItem('authToken');
				let url = `https://scholastic-quiz-app.herokuapp.com/questions`
				let data = {
					"description" : ques,
					"correct_answer" : val,
					"alternatives" : [
						{
							"text" : op1
						},
						{
							"text" : op2
						},
						{
							"text" : op3
						},
						{
							"text" : op4
						}
					] 
				}
				let response = null;
				try {
					await axios.post(url,data,{
						headers: {
							"auth-token" : token
						}}).then(res => {
						response = res;
					});
					if(response.status === 201) {
						setSubmit('Succesfully Submitted..')
					}else{
						setSubmit('Cannot Submit. Server error. Try later..')
					}
				} catch(error) {
					console.log(error);
				}
				setSubmit('');
				setTimeout(() => {setOpen(false);setSubmit('');}, 800);
		}
	};

	if(!isAdmin) {
		return (
			<Redirect to="/" />
		)
	} else { 
		return (
			loading? <Loading />
			:
			<div className="bg">
				<div>
					<h2 style={{ textAlign: 'center', marginTop: 0, textShadow: '0 0 15px #000' }}>Welcome to Admin Portal</h2>
				</div>
				<div style={{ display: 'flex', height: 'calc(100vh - 116px)', justifyContent: 'center', alignItems: 'center' }}>
					<Grid container spacing={3} style={{ width: '90%' }}>
						<Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Button variant="outlined" className="btn-red" onClick={handleClickOpen}>
								Add new question
							</Button>
						</Grid>
						<Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Button variant="outlined" className="btn-blue" onClick={handleClickOpenSub}>
								Show Submissions
							</Button>
						</Grid>
					</Grid>


				</div>
				<Dialog PaperProps={{ style: { backgroundColor: '#2d2d2d', color: '#cfcfcf', minWidth: '85%'  } }} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">View All Questions</DialogTitle>
					<AllQues />
					<DialogActions>
						<Button onClick={handleClose} className="btn-orange" style={{color: '#333 !important'}}>
							Close
						</Button>
						<Button onClick={handleClickOpenAdd} className="btn-orange" style={{color: '#333'}}>
							Add New Question
						</Button>
					</DialogActions>
				</Dialog>
				
				<Dialog PaperProps={{ style: { backgroundColor: '#2d2d2d', color: '#cfcfcf', minWidth: '60%' } }} open={openAdd} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Add Question</DialogTitle>
					<DialogContent>
						<TextInput
							autoFocus
							error={quesError.length === 0? false: true}
							helperText={quesError.length === 0? null: quesError}
							margin="dense"
							id="ques"
							label="Question"
							type="text"
							fullWidth
							variant="outlined"
							value={ques}
							onChange={handleQchange}
						/>
						<TextInput
							error={op1Error.length === 0? false: true}
							helperText={op1Error.length === 0? null: op1Error}
							margin="dense"
							id="op1"
							label="Option 1"
							type="text"
							fullWidth
							variant="outlined"
							onChange={handle1change}
						/>
						<TextInput
							error={op2Error.length === 0? false: true}
							helperText={op2Error.length === 0? null: op2Error}
							margin="dense"
							id="op2"
							label="Option 2"
							type="text"
							fullWidth
							variant="outlined"
							onChange={handle2change}
						/>
						<TextInput
							error={op3Error.length === 0? false: true}
							helperText={op3Error.length === 0? null: op3Error}
							margin="dense"
							id="op3"
							label="Option 3"
							type="text"
							fullWidth
							variant="outlined"
							onChange={handle3change}
						/>
						<TextInput
							error={op4Error.length === 0? false: true}
							helperText={op4Error.length === 0? null: op4Error}
							margin="dense"
							id="op4"
							label="Option 4"
							type="text"
							fullWidth
							variant="outlined"
							onChange={handle4change}
						/>
						<FormControl component="fieldset">
							<FormLabel style={{ color: '#ffa2000', paddingTop: 20 }} component="legend"><p className="correct-head">Correct Option</p></FormLabel>
							<p style={{color: '#f44336', fontSize: 14, margin: 0}}>{valueError}</p>
							<RadioGroup aria-label="correct-choice" value={value} onChange={handleChange} >
								<FormControlLabel value="op1" control={<Radio style={{color: '#ffa2000'}} />} label="Option 1" />
								<FormControlLabel value="op2" control={<Radio style={{color: '#ffa2000'}} />} label="Option 2" />
								<FormControlLabel value="op3" control={<Radio style={{color: '#ffa2000'}} />} label="Option 3" />
								<FormControlLabel value="op4" control={<Radio style={{color: '#ffa2000'}} />} label="Option 4" />
							</RadioGroup>
						</FormControl>
						<p style={{color: '#0f0', fontSize: 14, margin: 0}}>{submitResponse}</p>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} className="btn-orange">
							Cancel
					</Button>
						<Button onClick={handleSubmit} className="btn-orange">
							Submit
					</Button>
					</DialogActions>
					
				</Dialog>

				<Dialog PaperProps={{ style: { backgroundColor: '#2d2d2d', color: '#cfcfcf', minWidth: '85%' } }} open={openSub} onClose={handleClose} aria-labelledby="sub-dialog-title">
					<DialogTitle id="sub-dialog-title">Submissions</DialogTitle>
					<DialogContent>
						<SubTable />
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} className="btn-orange">
							Close
						</Button>
					</DialogActions>
				</Dialog>

			</div>
		)
	}
}

export default Admin;