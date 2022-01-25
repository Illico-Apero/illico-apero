import { CircularProgress, Fade, FormControl, Snackbar, TextareaAutosize, TextField, Typography } from '@material-ui/core';
import React from 'react'
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import { send } from 'emailjs-com';

import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoButton from '../components/IllicoButton';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import MuiAlert from '@material-ui/lab/Alert';
import IllicoAudio from '../utils/IllicoAudio';
import FormValidator from '../utils/FormValidator';



export default class Contact extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			from_name:'',
			reply_to:'',
			message:'',
			isLoading:false,
			showOkMessage:false,
			showErrorMessage:false,
			showEmailError:false
		}
	}

	componentDidMount() {
		this.setState({ loaded: true });
	}
	handleFromNameChange(value) {
		this.setState({from_name:value})
	}
	handleReplyToChange(value) {
		this.setState({reply_to:value});
		//TODO : email validation
	}
	handleMessageChange(value) {
		this.setState({message:value})
	}
	handleCloseShowOk(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showOkMessage: false });
	}
	handleCloseShowError(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showErrorMessage: false });
	}
	submitForm() {
		this.setState({isLoading:true});

		send(
			'service_y26g62n',
			'template_6af70o6',
			{
				from_name:this.state.from_name,
				reply_to:this.state.reply_to,
				message:this.state.message
			},
			'user_vNtSHKL24QOOuLljYo2Xi'
		)
			.then((response) => {
				IllicoAudio.playAddToCartAudio();
				this.setState({showOkMessage:true})
				this.resetState();
			})
			.catch((err) => {
				IllicoAudio.playAlertAudio();
				console.log('FAILED...', err);
				this.setState({showErrorMessage:true});
				this.resetState();
			});
	}

	resetState() {
		this.setState({isLoading:false});
		this.setState({message:''});
		this.setState({from_name:''});
		this.setState({reply_to:''});
	}

	render() {
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);

		return (
			<div>
				<IllicoSimpleAppBar to={previousPageRedirection} title='Nous contacter' />
				<Typography variant='h4' style={{ marginTop: '1em', color: '#b26a00'}}>
					Contactez-nous !
				</Typography>

				<FormControl style={{marginTop:'2em'}}>
					<TextField required={true} style={{marginBottom:'2em'}} id="outlined-basic" label="Votre nom/prénom" variant="outlined" name='from_name' value={this.state.from_name} onChange={(event) => this.handleFromNameChange(event.target.value)} />


					<TextField required={true} style={{marginBottom:'2em'}} id="outlined-basic" label="Votre email" variant="outlined" name='reply_to' value={this.state.reply_to} onChange={(event) => this.handleReplyToChange(event.target.value)} />


					<TextareaAutosize required={true} value={this.state.message} onChange={(event) => this.handleMessageChange(event.target.value)} style={{ width: '300px', height: '15em' }} name='message' placeholder="Votre message..." />

					<IllicoButton disabled={this.state.isLoading} color='primary' text="Envoyer !" onClick={() => this.submitForm()} />
					{
				this.state.isLoading ? 
				<div style={{marginRight:'auto', marginLeft:'auto'}}>
					<CircularProgress/>
				</div>
				:
				''
			}
			</FormControl>

			<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showOkMessage} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseShowOk(event, reason)}>
				<MuiAlert onClose={(event, reason) => this.handleCloseShowOk(event, reason)} severity='success'>
					Votre message a bien été envoyé 🎉
				</MuiAlert>
			</Snackbar>
			<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showErrorMessage} autoHideDuration={5000} onClose={(event, reason) => this.handleCloseShowError(event, reason)}>
				<MuiAlert onClose={(event, reason) => this.handleCloseShowError(event, reason)} severity='error'>
					Votre message n'a pas pu être envoyé... Contactez-nous sur les réseaux sociaux !
				</MuiAlert>
			</Snackbar>

			
		</div>
		)
	}
}
