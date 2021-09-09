import React from 'react'
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';


import IllicoButton from '../components/IllicoButton';
import StyledLink from '../components/Generic/StyledLink';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import addresses from '../assets/addresses.json';
import AddressEntity from '../models/AddressEntity';
import AddressService from '../network/services/AddressService';


export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            form: {
                email:  '',
                password: '',
                password_confirm: '',
                firstname: '',
                surname: '',
                phone: '',
                address: '',
                majority: false,
                cgv_cgu: false
            }
        }

        this.updateFormValue = this.updateFormValue.bind(this);
        this.updateAutoCompleteLabel = this.updateAutoCompleteLabel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.addressService = new AddressService();
    }

    componentDidMount() {
        this.setState({loaded:true});
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

        console.log(this.state);
    }

    /**
     * 
     * @param {*} event 
     * @param {AddressEntity} value 
     */
    updateAutoCompleteLabel(event, value) {
        console.log(event);
        console.log(value);
        let approxDistanceFromCenter = value.approx_meters_from_main_storage_center
        //TODO
    }

    handleSubmit() {
        // TODO : VALIDATE THAT EACH FIELD IS CORRECT
        // TODO : VALIDATE THAT ADDRESS IS IN DELIVRERY RANGE THANKS TO API
        // TODO : Create account if 1 & 2 OK
        // TODO : Auto Log In User + redirect to catalog
        console.log("hi");
        console.log(this.state);
    }

    validateForm() {

    }


    render() {
        const buttonStyle = {
            marginTop:'0.7em',
            marginBottom:'0.7em',
            width:'16em'
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

        // on va à gauche par défaut, ou bien à la direction donnée par les props
        const slideDirection =  (this.props.location.state === undefined) ? 'left' : this.props.location.state.slideDirection

        // limit to 10 addresses to display
        const OPTIONS_LIMIT = 10;
        const filterOptions = createFilterOptions({
          limit: OPTIONS_LIMIT
        });

        return (
            <Slide direction={slideDirection} in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
                <div>
                    <IllicoSimpleAppBar to='/' title='Inscription'/>
                    <FormControl>
                        <TextField id='email'               error={false} helperText='' size='small' variant='outlined' required={true} style={buttonStyle} type='email'    label='Adresse e-mail'            onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} }/> <br/>
                        <TextField id='password'            error={false} helperText='' size='small' variant='outlined' required={true} style={buttonStyle} type='password' label='Mot de passe'              onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} }/> <br/>
                        <TextField id='password_confirm'    error={false} helperText='' size='small' variant='outlined' required={true} style={buttonStyle} type='password' label='Confirmer le mot de passe' onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} }/> <br/>
                        <TextField id='firstname'           error={false} helperText='' size='small' variant='outlined' required={true} style={buttonStyle} type='text'     label='Prénom'                    onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} }/> <br/>
                        <TextField id='surname'             error={false} helperText='' size='small' variant='outlined' required={true} style={buttonStyle} type='text'     label='Nom'                       onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} }/> <br/>
                        
                        <TextField id='phone'               error={false} size='small'               variant='outlined' required={true} style={buttonStyle} type='tel'      label='Numéro de téléphone'       onChange={(event) => {this.updateFormValue(event.target.id, event.target.value)} } helperText="Sur 10 chiffres, sans indicatif" /> <br/>
                        

                        
                        <Autocomplete
                            id="address"
                            options={addresses}
                            getOptionLabel={(option) => option.streetNumber + ' ' + option.street + ' ' + option.city}

                            filterOptions={filterOptions}
                            clearOnEscape
                            onChange={(event, value) => {this.updateAutoCompleteLabel(event, value)}}

                            renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Addresse"
                                variant="outlined"
                                helperText=''
                                error={false}
                            />
                            )}
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
                        </div>

                        <div style={{marginTop:'1em'}}>
                            <Checkbox id='cgv_cgu' color='primary' onChange={(event) => {this.updateFormValue(event.target.id, event.target.checked)} }/>
                            <Typography variant='overline'>
                                J'accepte les &nbsp;
                                <StyledLink to={termsRedirectState}>
                                    CGV/CGU
                                </StyledLink> 
                                &nbsp; &nbsp;
                            </Typography>
                        </div>

                        <IllicoButton color='primary' text="M'enregistrer !" onClick={ () => this.handleSubmit()}/>
                    </FormControl>
                </div>
            </Slide>
        );
    }
}
