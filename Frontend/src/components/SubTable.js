import React from 'react';
import {
	Grid
} from '@material-ui/core';
import MaterialTable from "material-table";
import Loading from "../pages/Loading";
import axios from "axios";
export default function SubTable(){

	const [loading, setLoading] = React.useState(true);
    const [noSubText, setNoSub] = React.useState('');
	const columns = [
		{ field: 'name', title: 'Name', cellStyle: { minWidth: 100 }, headerStyle: { minWidth: 100 } }, { field: 'email', title: 'E-mail', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } },
		{ field: 'score', title: 'Score', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 }, align: 'right' },
		{ field: 'q1', title: 'Ques1', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a1', title: 'Ans1', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q2', title: 'Ques2', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a2', title: 'Ans2', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q3', title: 'Ques3', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a3', title: 'Ans3', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q4', title: 'Ques4', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a4', title: 'Ans4', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q5', title: 'Ques5', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a5', title: 'Ans5', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q6', title: 'Ques6', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a6', title: 'Ans6', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q7', title: 'Ques7', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a7', title: 'Ans7', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q8', title: 'Ques8', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a8', title: 'Ans8', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q9', title: 'Ques9', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a9', title: 'Ans9', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q10', title: 'Ques10', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a10', title: 'Ans10', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q11', title: 'Ques11', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a11', title: 'Ans11', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q12', title: 'Ques12', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a12', title: 'Ans12', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q13', title: 'Ques13', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a13', title: 'Ans13', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q14', title: 'Ques14', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a14', title: 'Ans14', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q15', title: 'Ques15', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a15', title: 'Ans15', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q16', title: 'Ques16', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a16', title: 'Ans16', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q17', title: 'Ques17', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a17', title: 'Ans17', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q18', title: 'Ques18', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a18', title: 'Ans18', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q19', title: 'Ques19', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a19', title: 'Ans19', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q20', title: 'Ques20', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a20', title: 'Ans20', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q21', title: 'Ques21', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a21', title: 'Ans21', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q22', title: 'Ques22', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a22', title: 'Ans22', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q23', title: 'Ques23', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a23', title: 'Ans23', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q24', title: 'Ques24', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a24', title: 'Ans24', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
		{ field: 'q25', title: 'Ques25', cellStyle: { minWidth: 200 }, headerStyle: { minWidth: 200 } }, { field: 'a25', title: 'Ans25', cellStyle: { minWidth: 50 }, headerStyle: { minWidth: 50 } },
	];
	function createData(nam,em,s,que1,ans1,que2,ans2,que3,ans3,que4,ans4,que5,ans5,que6,ans6,que7,ans7,que8,ans8,que9,ans9,que10,ans10,que11,ans11,que12,ans12,que13,ans13,que14,ans14,que15,ans15,que16,ans16,que17,ans17,que18,ans18,que19,ans19,que20,ans20,que21,ans21,que22,ans22,que23,ans23,que24,ans24,que25,ans25) {
		return { name: nam, email: em, score: s, q1: que1, 
			a1: ans1, q2: que2, a2: ans2, q3: que3, a3: ans3, 
			q4: que4, a4: ans4, q5: que5, a5: ans5, q6: que6, 
			a6: ans6, q7: que7, a7: ans7, q8: que8, a8: ans8, 
			q9: que9, a9: ans9, q10: que10, a10: ans10, 
			q11: que11, a11: ans11, q12: que12, a12: ans12, 
			q13: que13, a13: ans13, q14: que14, a14: ans14, 
			q15: que15, a15: ans15, q16: que16, a16: ans16, 
			q17: que17, a17: ans17, q18: que18, a18: ans18, 
			q19: que19, a19: ans19, q20: que20, a20: ans20, 
			q21: que21, a21: ans21, q22: que22, a22: ans22, 
			q23: que23, a23: ans23, q24: que24, a24: ans24, 
			q25: que25, a25: ans25
		}
	}
	const [rows, setRows] = React.useState([]);

	const del = async(data) => {
		let token = localStorage.getItem('authToken');
		let url = `https://scholastic-quiz-app.herokuapp.com/resetUser`;
		let response = null;

		try {
			await axios.put(url, {
				"email": data.email,
				}, 
				{
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			});
			if(response.status === 200){
				getSubmissions();
			}

		} catch(error) {
			console.log(error);
		}
		setLoading(false);
		getSubmissions();
	}
    
    const getSubmissions = async () => {
		let token = localStorage.getItem('authToken');
		let subs = []
		var i,j,k;
		var q = [];
		var a = [];
		setRows(null);

		let url = `https://scholastic-quiz-app.herokuapp.com/viewSubmissions`;
		let response = null;

		try {
			await axios.get(url, {
				headers: {
					"auth-token": token
				}
			}).then(res => {
				response = res;
			});
			if(response.status === 200){
				if(response.data.length === 0){
					setNoSub('No Submissions yet...');
				}
				setLoading(true);
				for(i = 0; i < response.data.length; i++){
					var name = response.data[i].name;
					var email = response.data[i].email;
					var score = response.data[i].score;
					for(j = 0, k = 0; j < response.data[i].responses.length; j++, k++){
						q[j] = response.data[i].responses[j].questionText;
						a[j] = response.data[i].responses[j].selectedOption;
					}
					for(; k < 25; k++){
						q[k] = "Not Assigned";
						a[k] = "N.A.";
					}
					subs = [...subs,createData(name,email,score,q[0],a[0],q[1],a[1],q[2],a[2],q[3],a[3],q[4],a[4],q[5],a[5],q[6],a[6],q[7],a[7],q[8],a[8],q[9],a[9],q[10],a[10],q[11],a[11],q[12],a[12],q[13],a[13],q[14],a[14],q[15],a[15],q[16],a[16],q[17],a[17],q[18],a[18],q[19],a[19],q[20],a[20],q[21],a[21],q[22],a[22],q[23],a[23],q[24],a[24])];				}
				setRows(subs);
				setLoading(false);
			}

		} catch(error) {
			console.log(error);
		}
	}

    React.useEffect(() => {
		getSubmissions();
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
				 },
				 pageSize: 10
			 }}
			 editable={{
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
		</Grid>
    )
}