import React from 'react'
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import StyledLink from '../components/Generic/StyledLink';
import UserService from '../network/services/UserService';
import FrontEndLogService from '../network/services/FrontEndLogService';
import UserEntity from '../models/UserEntity';
import ApiResponse from '../models/api/ApiResponse';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import FormValidator from '../utils/FormValidator';

import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import IllicoAudio from '../utils/IllicoAudio';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import IllicoAlreadyConnected from '../components/IllicoAlreadyConnected';
import IllicoButton from '../components/IllicoButton';

export default class Login extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			isUserLoggedIn: false,
			isLoading: false,
			nameFromApi: '',
			openMainAlert: false,
			openLoggedInOkAlert: false,
			openLoggedInErrorAlert: false,
			failReason: '',
			form: {
				email: '',
				password: ''
			},
			errors: {
				emailError: false,
				emailHelper: '',
				passwordError: false,
				passwordHelper: '',
			}
		}
		this.userService = new UserService();
		this.frontEndLogService = new FrontEndLogService();
	}

	handleCloseMainAlert(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		IllicoAudio.playTapAudio();
		this.setState({ openMainAlert: false });
	}
	handleCloseOpenLoggedInErrorAlert(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		IllicoAudio.playTapAudio();
		this.setState({ openLoggedInErrorAlert: false });
	}
	handleCloseOpenLoggedInOkAlert(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		IllicoAudio.playTapAudio();
		this.setState({ openLoggedInOkAlert: false });
	}
	componentDidMount() {
		this.setState({ isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn')) }, () => {
			this.setState({ loaded: true });
		});
	}
	/**
	* Triggered everytime a form field changes (checkbox or textfield)
	* @param {*} fieldId 
	* @param {*} newValue 
	*/
	updateFormValue(fieldId, newValue) {
		let updatedForm = this.state.form;
		updatedForm[fieldId] = newValue;
		this.setState({
			form: updatedForm
		});

		if (fieldId === 'email') {
			this.updateError(FormValidator.isEmailValid, newValue, 'emailError', 'emailHelper', "L'email est invalide");
		}
		else if (fieldId === "password") {
			this.updateError(FormValidator.isPasswordInBounds, newValue, 'passwordError', 'passwordHelper', "Doit être compris entre 8 et 32 caractères");
		}
	}
	updateError(isValid, newValue, errorKey, helperKey, errorHelperText) {
		let updatedErrors = this.state.errors;
		if (isValid(newValue) || newValue === '') {
			updatedErrors[errorKey] = false;
			updatedErrors[helperKey] = '';
		}
		else {
			updatedErrors[errorKey] = true;
			updatedErrors[helperKey] = errorHelperText;
		}
	}
	handleSubmit() {
		if (this.validateForm()) {
			this.setState({ isLoading: true })
			let form = this.state.form;
			let userEntity = new UserEntity(null, null, form.email, form.password, null, null, null, null);

			// SIGNING IN USER //
			this.userService.signIn(userEntity, async (data) => {
				/** @type ApiResponse */
				let apiResponse = JSON.parse(data);
				if (apiResponse.status === ApiResponse.GET_SUCCESS()) {
					this.setState({ openLoggedInOkAlert: true })
					IllicoAudio.playRegisterOrLogInAudio();
					userEntity = apiResponse.response.userEntity; // we replace the whole user so we retrieve all neccesaries foreign keys and so on
					userEntity.jwt = apiResponse.response.jwt;

					// STORING USER DATA IN LOCAL STORAGE //
					localStorage.setItem('isUserLoggedIn', JSON.stringify(true));
					localStorage.setItem('userEntity', JSON.stringify(userEntity));
					localStorage.setItem('lastLogin', JSON.stringify(Date.now()));

					// REDIRECTING USER TO HOME //
					setTimeout(() => {
						this.props.history.push("/home"); // redirection 👌
						this.setState({ isLoading: false })
					}, 1500); // waits for 1500ms
				}
				else {
					console.error("Could not log in the user : " + JSON.stringify(apiResponse));
					if (apiResponse.response.includes("The given email is not registered")) {
						this.setState({ failReason: "L'email n'est pas enregistrée ❌" })
					}
					else if (apiResponse.response.includes("The given password is incorrect")) {
						this.setState({ failReason: 'Mot de passe inccorect ❌' })
					}
					else {
						this.setState({ failReason: 'Une erreur inconnue est survenue... Contactez-nous pour identifier le problème 💌 !' })
						this.frontEndLogService.saveLog(null, "Could not log in user : " + JSON.stringify(userEntity) + " (" + JSON.stringify(apiResponse.response) + ")");
					}
					IllicoAudio.playAlertAudio();
					this.setState({ openLoggedInErrorAlert: true })
				}
				this.setState({ isLoading: false })
			})

		}
		else {
			IllicoAudio.playAlertAudio();
			this.setState({ openMainAlert: true });
		}
	}
	validateForm() {
		let errors = this.state.errors;
		let form = this.state.form;

		return errors.emailError === false
			&& errors.passwordError === false
			&& form.email !== ''
			&& form.password !== '';
	}

	render() {
		const buttonStyle = {
			marginTop: '0.7em',
			marginBottom: '0.7em',
			width: '16em'
		}

		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);
		// à gauche par défaut ou bien donné par les props
		const slideDirection = RedirectionStateHandler.getSlideDirection('right', this.props.location);
		const forgottenPasswordRedirectState = {
			pathname: '/forgotten-password',
			state: {
				backUrl: '/login',
				slideDirection: 'left'
			}
		}

		return (
			<div>
			{
				this.state.loaded ?
					<div>
					<IllicoSimpleAppBar to={previousPageRedirection} title='Connexion' />
					<Slide direction={slideDirection} in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
						<div>
						{
							this.state.isUserLoggedIn ?
							<IllicoAlreadyConnected/>
							:
								<FormControl>
								<TextField id='email' error={this.state.errors.emailError} helperText={this.state.errors.emailHelper} size='small' variant='outlined' required={true} style={buttonStyle} type='email' label='Adresse e-mail' onChange={(event) => { this.updateFormValue(event.target.id, event.target.value) }} onClick={() => IllicoAudio.playTapAudio()} /> <br />
								<TextField id='password' error={this.state.errors.passwordError} helperText={this.state.errors.passwordHelper} size='small' variant='outlined' required={true} style={buttonStyle} type='password' label='Mot de passe' onChange={(event) => { this.updateFormValue(event.target.id, event.target.value) }} inputProps={{ maxLength: 32 }} onClick={() => IllicoAudio.playTapAudio()} /> <br />

								{this.state.isLoading ?
									<div>
										<CircularProgress />
									</div>
									: null}
								<IllicoButton disabled={this.state.isLoading} color='primary' text="Me connecter !" onClick={() => this.handleSubmit()} />
								<div aria-disabled={this.state.isLoading} onClick={() => IllicoAudio.playNavigationForwardAudio()}>
									<StyledLink to={forgottenPasswordRedirectState}>Mot de passe oublié ?</StyledLink>
								</div>
							</FormControl>
						}
							<div id='utils'>
								{/* MAIN ALERT SNACKBAR */}
								<Snackbar open={this.state.openMainAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseMainAlert(event, reason)}>
									<MuiAlert onClose={(event, reason) => this.handleCloseMainAlert(event, reason)} severity="error">
										Veuillez correctement renseigner le formulaire !
									</MuiAlert>
								</Snackbar>

								{/* CONNECTED SNACKBAR */}
								<Snackbar open={this.state.openLoggedInOkAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseOpenLoggedInOkAlert(event, reason)}>
									<MuiAlert onClose={(event, reason) => this.handleCloseOpenLoggedInOkAlert(event, reason)} severity="success">
										Hey {this.state.nameFromApi} 🍻 ! Redirection en cours...
									</MuiAlert>
								</Snackbar>

								{/* FAIL SNACKBAR */}
								<Snackbar open={this.state.openLoggedInErrorAlert} autoHideDuration={5000} onClose={(event, reason) => this.handleCloseOpenLoggedInErrorAlert(event, reason)}>
									<MuiAlert onClose={(event, reason) => this.handleCloseOpenLoggedInErrorAlert(event, reason)} severity="error">
										{this.state.failReason}
									</MuiAlert>
								</Snackbar>
							</div>
						</div>
					</Slide>
				</div>
				:
				<CircularProgress/>
			}
			</div>
		)
	}
}
