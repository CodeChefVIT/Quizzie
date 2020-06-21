import {TextField, withStyles} from "@material-ui/core";

const TextInput = withStyles({
	root: {
		'& label': {
			color: 'rgba(255,255,255, 0.7)',
		},
		'& label.Mui-focused': {
			color: 'orange',
		},
		'& .MuiInput-underline:after': {
			borderBottomColor: 'orange',
		},
		'& .MuiInputBase-input': {
			color: 'white',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
			  borderColor: 'rgba(255,255,255, 0.3)',
			},
			'&:hover fieldset': {
			  borderColor: 'orange',
			},
			'&.Mui-focused fieldset': {
			  borderColor: 'orange',
			},
		  },
	}
})(TextField);

export default TextInput;