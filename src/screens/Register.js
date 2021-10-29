import React from 'react'
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import IllicoButton from '../components/IllicoButton';
import StyledLink from '../components/Generic/StyledLink';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import AddressService from '../network/services/AddressService';
import UserService from '../network/services/UserService';
import FormValidator from '../utils/FormValidator';
import Radius from '../models/Radius';
import UserEntity from '../models/UserEntity';
import UserPersonalInformationsEntity from '../models/UserPersonalInformationsEntity';
import ApiResponse from '../models/api/ApiResponse';
import FrontEndLogService from '../network/services/FrontEndLogService';
import Utils from '../utils/Utils';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoAudio from '../utils/IllicoAudio';
import IllicoAddresses from '../components/IllicoAddresses';


//TODO : display a message "already logged in" or redirect to home if already logged in.

/**
 * @param {Boolean} hideTopAppBar
 * @param {Boolean} useNegativeZIndex
 */
export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isUserLoggedIn: false,
            openMajorityAlert: false,
            openLegalTermsAlert: false,
            openMainAlert: false,
            openAccountCreationOkAlert: false,
            openAccountCreationErrorAlert: false,
            accountCreationErrorText: "Oups... Votre compte n'a pas pu être créé... Réessayez plus tard ou contactez-nous 💌 !",
            isLoading:false,
            form: {
                email:  '',
                password: '',
                passwordConfirm: '',
                firstname: '',
                surname: '',
                phone: '',
                address: '',
                addressObject: null,
                majority: false,
                cgvCgu: false
            },
            errors:{
                emailError:false,
                emailHelper:'',
                passwordError:false,
                passwordHelper:'',
                passwordConfirmError:false,
                passwordConfirmHelper:'',
                firstname_error:false,
                firstnameHelper:'',
                surnameError:false,
                surnameHelper:'',
                phoneError:false,
                phoneHelper:'Sur 10 chiffres, sans indicatif',
                addressError:false,
                addressHelper:'Veuillez saisir une addresse'
            },
            radius: {
                distance: 4000
            }
        }
        this.checkAndRefreshAddress = this.checkAndRefreshAddress.bind(this);
        this.frontEndLogService = new FrontEndLogService();
        this.userService = new UserService();
        this.addressService = new AddressService();
        this.addressService.getDeliveryRadius(
        /** @param {Radius} data */
        (data) => {
            let radius = this.state.radius;
            radius["distance"] = data.radius;
        });
    }

    componentDidMount() {
        this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
            this.setState({loaded:true});
        });
    }

    handleCloseLegalTermsAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({openLegalTermsAlert : false});
    }
    handleCloseMajorityAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({openMajorityAlert : false});
    }
    handleCloseMainAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({openMainAlert : false});
    }
    handleCloseOpenAccountCreationOkAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({openAccountCreationOkAlert : false});
    }
    handleCloseOpenAccountCreationErrorAlert(event, reason) {
        if (reason === 'clickaway') {
            
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({openAccountCreationErrorAlert : false});
    }

    /**
     * Triggered everytime a form field changes (checkbox or textfield)
     * @param {*} fieldId 
     * @param {*} newValue 
     */
    updateFormValue(fieldId, newValue) {
        let updatedForm = this.state.form;
        updatedForm[fieldId] = newValue;
        this.setState( {
            form: updatedForm
        });

        if(fieldId === 'email') {
            this.updateError(FormValidator.isEmailValid, newValue, 'emailError', 'emailHelper', "L'email est invalide");
        }
        else if(fieldId === "password") {
            this.updateError(FormValidator.isPasswordInBounds, newValue, 'passwordError', 'passwordHelper', "Doit être compris entre 8 et 32 caractères");
            if(this.state.form.passwordConfirm !== '') {
                let param = [];
                param.push(this.state.form.password);
                param.push(this.state.form.passwordConfirm);
                this.updateError(FormValidator.doesPasswordMatch, param, 'passwordConfirmError', 'passwordConfirmHelper', "Les mots de passe doivent correspondre");
            }
        }
        else if(fieldId === "passwordConfirm") {
            let param = [];
            param.push(this.state.form.password);
            param.push(this.state.form.passwordConfirm);
            this.updateError(FormValidator.doesPasswordMatch, param, 'passwordConfirmError', 'passwordConfirmHelper', "Les mots de passe doivent correspondre");
        }
        else if(fieldId === "firstname") {
            this.updateError(FormValidator.isFirstnameInBounds, newValue, 'firstname_error', 'firstnameHelper', "Doit être inférieur à 50 caractères");
        }
        else if(fieldId === "surname") {
            this.updateError(FormValidator.isSurnameInBounds, newValue, 'surnameError', 'surnameHelper', "Doit être inférieur à 50 caractères");
        }
        else if(fieldId === "phone") {
            this.updateError(FormValidator.isPhoneValid, newValue, 'phoneError', 'phoneHelper', "Numéro invalide. Doit être sur 10 chiffres, sans indicatif");
        }
    }

    

    /**
     * 
     * @param {*} event 
     */
     checkAndRefreshAddress(event, value) {
        let updatedErrors = this.state.errors;
        let form = this.state.form;
        if(value != null) {
            form.address = FormValidator.formatAddress(value);
            form.addressObject = value;
            let approxDistanceFromCenter = value.approxMetersFromMainStorageCenter;
            if(approxDistanceFromCenter > this.state.radius.distance) {
                updatedErrors.addressError = true;
                updatedErrors.addressHelper = "Cette addresse n'est pas éligible !";
            }
            else if(approxDistanceFromCenter < this.state.radius.distance) {
                updatedErrors.addressError = false;
                updatedErrors.addressHelper = '';
            }
        } else {
            updatedErrors.addressError = true;
            updatedErrors.addressHelper = 'Veuillez saisir une addresse';
            form.addressObject = null;
        }
        this.setState({errors:updatedErrors});
    }

    /**
     * 
     * @param {Function} isValid 
     * @param {String} newValue 
     * @param {String} errorKey 
     * @param {String} helperKey 
     * @param {String} errorHelperText 
     */
    updateError(isValid, newValue, errorKey, helperKey, errorHelperText) {
        let updatedErrors = this.state.errors;
        if(isValid(newValue) || newValue === '') {
            updatedErrors[errorKey] = false;
            updatedErrors[helperKey] = '';
        }
        else {
            updatedErrors[errorKey] = true;
            updatedErrors[helperKey] = errorHelperText;
        }
        this.setState({errors:updatedErrors});
    }

    handleSubmit() {
        if(this.validateForm()) {
            if(this.state.form.majority) {
                if(this.state.form.cgvCgu) {
                    this.setState({isLoading:true})

                    let form = this.state.form;
                    let userPersonalInformationsEntity = new UserPersonalInformationsEntity(null, form.firstname, form.surname, form.phone, form.addressObject);
                    let userEntity = new UserEntity(null, null, form.email, form.password, null, null, null, userPersonalInformationsEntity);

                    // SIGNING UP USER //
                    this.userService.signUp(userEntity, 
                    (data) => {
                        /** @type ApiResponse */
                        let apiResponse = JSON.parse(data);
                        if(apiResponse.status === ApiResponse.GET_SUCCESS()) {
                            console.info("Account well created !");
                            IllicoAudio.playRegisterOrLogInAudio();
                            this.setState({openAccountCreationOkAlert: true})

                            // SIGNING IN USER //
                            this.userService.signIn(userEntity, (data) => {
                                /** @type ApiResponse */
                                let apiResponse = JSON.parse(data);
                                if(apiResponse.status === ApiResponse.GET_SUCCESS()) {
                                    userEntity = apiResponse.response.userEntity; // we replace the whole user so we retrieve all neccesaries foreign keys and so on
                                    userEntity.jwt = apiResponse.response.jwt;

                                    // STORING USER DATA IN LOCAL STORAGE //
                                    localStorage.setItem('isUserLoggedIn', JSON.stringify(true)); // password is hashed in there
                                    localStorage.setItem('userEntity', JSON.stringify(userEntity));
                                    localStorage.setItem('lastLogin', JSON.stringify(Date.now()));

                                    // REDIRECTING USER
                                    setTimeout(() => {
                                        this.props.history.push("/home"); // redirection 👌
                                        this.setState({isLoading:false})
                                    }, 1500); // waits for 1500ms

                                }
                                else {
                                    console.error("Could not log in the user : " + JSON.stringify(apiResponse));
                                    this.frontEndLogService.saveLog(null, "Could not log in user : "  + JSON.stringify(userEntity)  + " (" + JSON.stringify(apiResponse.response) + ")");
                                    this.setState( { accountCreationErrorText: "Oups... Nous n'avons pas pu vous identifier automatiquement..."});
                                    this.setState({openAccountCreationErrorAlert: true})
                                }
                            })
                        }
                        else {
                            console.error("Account not created : " + JSON.stringify(apiResponse.response));
                            if(apiResponse.response.includes("@") && apiResponse.response.includes("already exists")) {
                                this.setState({ accountCreationErrorText: "Un compte avec cet email existe déjà... 😱" })
                            }
                            else {
                                this.setState( { accountCreationErrorText: "Oups... Votre compte n'a pas pu être créé... Réessayez plus tard ou contactez-nous 💌 !"});
                            }
                            this.frontEndLogService.saveLog(null, "Unknown account creation error with user : " + JSON.stringify(userEntity) + "(" + apiResponse.response + ")");
                            IllicoAudio.playAlertAudio();
                            this.setState({openAccountCreationErrorAlert: true})
                            this.setState({isLoading:false});
                        }
                    });

                }
                else {
                    IllicoAudio.playAlertAudio();
                    this.setState({openLegalTermsAlert : true})
                }
            }
            else {
                IllicoAudio.playAlertAudio();
                this.setState({openMajorityAlert : true})
            }
        }
        else {
            IllicoAudio.playAlertAudio();
            this.setState({openMainAlert: true});
        }
    }

    /**
     * 
     * @returns {Boolean}
     */
    validateForm() {
        let errors = this.state.errors;
        let form = this.state.form;
        return errors.emailError            === false
            && errors.passwordError         === false
            && errors.passwordConfirmError === false
            && errors.firstname_error        === false
            && errors.surnameError          === false
            && errors.phoneError            === false
            && errors.addressError          === false
            && form.addressObject           !== null
            && form.address                  !== ''
            && form.email                    !== ''
            && form.password                 !== ''
            && form.passwordConfirm         !== ''
            && form.firstname                !== ''
            && form.surname                  !== ''
            && form.phone                    !== ''
    }

    render() {
        const buttonStyle = {
            marginTop:'0.7em',
            marginBottom:'0.7em',
            width:'16em',
            zIndex: this.props.useNegativeZIndex ? -1 : 0
        }
        
        // Those are the states we need to passe to subPages, so that they are aware of the context : then we can use 'back' redirection from sub pages.
        const deliveryZoneRedirectState = {
            pathname: '/delivery-zone',
            state: {
                backUrl:'/register'
            }
        }

        const termsRedirectState = {
            pathname: '/legal-terms',
            state: {
                backUrl:'/register'
            }
        }
        
        const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);
        // on va à gauche par défaut, ou bien à la direction donnée par les props
        const slideDirection =  RedirectionStateHandler.getSlideDirection('left', this.props.location);



        return (
            <div>
                {
                    this.props.hideTopAppBar ?
                    ''
                    :
                    <IllicoSimpleAppBar to={previousPageRedirection === undefined ? '/' : previousPageRedirection} title='Inscription'/>
                }

                <Slide direction={slideDirection} in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
                    <FormControl>
                        <TextField id='email'               error={this.state.errors.emailError}            helperText={this.state.errors.emailHelper}                    size='small' variant='outlined' required={true} style={buttonStyle} type='email'    label='Adresse e-mail'            onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)}} onClick={() => IllicoAudio.playTapAudio()}/> <br/>
                        <TextField id='password'            error={this.state.errors.passwordError}         helperText={this.state.errors.passwordHelper}                 size='small' variant='outlined' required={true} style={buttonStyle} type='password' label='Mot de passe'              onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } inputProps={{maxLength :32}} onClick={() => IllicoAudio.playTapAudio()} /> <br/>
                        <TextField id='passwordConfirm'    error={this.state.errors.passwordConfirmError} helperText={this.state.errors.passwordConfirmHelper}         size='small' variant='outlined' required={true} style={buttonStyle} type='password' label='Confirmer le mot de passe' onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } inputProps={{maxLength :32}} onClick={() => IllicoAudio.playTapAudio()}/> <br/>
                        <TextField id='firstname'           error={this.state.errors.firstname_error}        helperText={this.state.errors.firstnameHelper}                size='small' variant='outlined' required={true} style={buttonStyle} type='text'     label='Prénom'                    onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } inputProps={{maxLength :50}} onClick={() => IllicoAudio.playTapAudio()}/> <br/>
                        <TextField id='surname'             error={this.state.errors.surnameError}          helperText={this.state.errors.surnameHelper}                  size='small' variant='outlined' required={true} style={buttonStyle} type='text'     label='Nom'                       onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } inputProps={{maxLength :50}} onClick={() => IllicoAudio.playTapAudio()}/> <br/>
                        <TextField id='phone'               error={this.state.errors.phoneError}            helperText={this.state.errors.phoneHelper}                    size='small' variant='outlined' required={true} style={buttonStyle} type='tel'      label='Numéro de téléphone'       onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } inputProps={{maxLength :10}} onClick={() => IllicoAudio.playTapAudio()}/> <br/>
                        

                        <IllicoAddresses addressHelper={this.state.errors.addressHelper} 
                            addressError={this.state.errors.addressError}
                            onChange={this.checkAndRefreshAddress} 
                            useNegativeZIndex={this.props.useNegativeZIndex}
                        />
                        {/* <TextField id='address'             error={false} size='small'               variant='outlined' required={true}                     type='text'     label='Adresse'                   onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } helperText="Sur Dijon et alentours uniquement*" style={{ marginTop:'0.7em', marginBottom:'0.5em',width:'16em'}}/> */}
                        
                            <StyledLink to={deliveryZoneRedirectState} style={{marginBottom:'1em'}}>
                                <Typography variant="body2">
                                *Consulter la zone de livraison éligible
                                </Typography>
                            </StyledLink>
                        
                        <div>
                            <Checkbox id='majority' color='primary' onChange={(event) => {this.updateFormValue(event.target.id, event.target.checked)} }/>
                            <Typography variant='overline'>
                                Je confirme être majeur
                            </Typography>

                            <Snackbar open={this.state.openMajorityAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseMajorityAlert(event, reason)}>
                                <MuiAlert onClose={(event, reason) => this.handleCloseMajorityAlert(event, reason)} severity="error">
                                Vous devez être majeur pour créer un compte !
                                </MuiAlert>
                            </Snackbar>

                        </div>

                        <div style={{marginTop:'1em'}}>
                            <Checkbox id='cgvCgu' color='primary' onChange={(event) => {this.updateFormValue(event.target.id, event.target.checked)} }/>
                            <Typography variant='overline'>
                                J'accepte les &nbsp;
                                <StyledLink to={termsRedirectState}>
                                    CGV/CGU
                                </StyledLink> 
                                &nbsp; &nbsp;
                            </Typography>

                            <Snackbar open={this.state.openLegalTermsAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseLegalTermsAlert(event, reason)}>
                                <MuiAlert onClose={(event, reason) => this.handleCloseLegalTermsAlert(event, reason)} severity="error">
                                Vous devez accepter nos CGV et CGU pour créer un compte !
                                </MuiAlert>
                            </Snackbar>
                        </div>

                        <div>

                            {this.state.isLoading ? 
                            <div>
                                <CircularProgress/>
                            </div>
                            : null}
                            <IllicoButton disabled={this.state.isLoading} color='primary' text="M'enregistrer !" onClick={ () => this.handleSubmit()}/>
                        </div>

                        
                        {/* MAIN ALERT SNACKBAR */}
                        <Snackbar open={this.state.openMainAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseMainAlert(event, reason)}>
                                <MuiAlert onClose={(event, reason) => this.handleCloseMainAlert(event, reason)} severity="error">
                                Veuillez correctement renseigner le formulaire !
                                </MuiAlert>
                            </Snackbar>

                        {/* ACCOUNT CREATED SNACKBAR */}
                        <Snackbar onAnimationStart={() => console.log('animation start')} open={this.state.openAccountCreationOkAlert} autoHideDuration={4000} onClose={(event, reason) => this.handleCloseOpenAccountCreationOkAlert(event, reason)}>
                            <MuiAlert onClose={(event, reason) => this.handleCloseOpenAccountCreationOkAlert(event, reason)} severity="success">
                            {this.state.form.firstname}, votre compte a été créé avec succès 👌🍻💥. Vous allez être redirigé...
                            </MuiAlert>
                        </Snackbar>

                        {/* ACCOUNT NOT CREATED SNACKBAR */}
                        <Snackbar open={this.state.openAccountCreationErrorAlert} autoHideDuration={8000} onClose={(event, reason) => this.handleCloseOpenAccountCreationErrorAlert(event, reason)}>
                            <MuiAlert onClose={(event, reason) => this.handleCloseOpenAccountCreationErrorAlert(event, reason)} severity="error">
                                {this.state.accountCreationErrorText}
                            </MuiAlert>
                        </Snackbar>

                    </FormControl>
                 </Slide>
            </div>
        );
    }
}
