import {TextField, withStyles} from "@material-ui/core";

const TextInput = withStyles({
	root: {
		'& label': {
			color: 'rgba(0,0,0,0.7)',
		},
		'& label.Mui-focused': {
			color: '#2980B9',
		},
		'& .MuiInput-underline:after': {
			borderBottomColor: '#2980B9',
		},
		'& .MuiInputBase-input': {
			color: 'black !important',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
			  borderColor: 'rgba(0,0,0,0.7)',
			},
			'&:hover fieldset': {
			  borderColor: '#2980B9',
			},
			'&.Mui-focused fieldset': {
			  borderColor: '#2980B9',
			},
		  },
	}
})(TextField);

export default TextInput;