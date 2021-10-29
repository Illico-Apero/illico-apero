import React from 'react'
import Slide from '@material-ui/core/Slide';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import { Badge, Card, CardContent, CardMedia, FormControl, Grid, Paper, Typography } from '@material-ui/core';
import CartEntity from '../models/CartEntity';
import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse';
import CartService from '../network/services/CartService';
import FrontEndLogService from '../network/services/FrontEndLogService';
import IllicoAskForConnection from '../components/IllicoAskForConnection';
import { Alert } from '@material-ui/lab';
import IllicoPriceRecapBottomBar from '../components/IllicoPriceRecapBottomBar';
import UserEntity from '../models/UserEntity';
import IllicoAddresses from '../components/IllicoAddresses';
import FormValidator from '../utils/FormValidator';
import AddressService from '../network/services/AddressService';

export default class Checkout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isUserLoggedIn: false,
            /**@type {UserEntity} userEntity */
            userEntity: null,
            quantityInCart: 0,
            /** @type {CartEntity} cartEntity */
            cartEntity:null,
            cartLoadingError:false,
            addressError:false,
            addressHelper:'',
            radius: {
                distance: 4000
            }
        }

        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.cartService = new CartService();
        this.frontEndLogService = new FrontEndLogService();
        this.addressService = new AddressService();
        this.addressService.getDeliveryRadius(
        /** @param {Radius} data */
        (data) => {
            let radius = this.state.radius;
            radius["distance"] = data.radius;
        });
    }

    componentDidMount() { //TODO : CODE REDUNDANCY WITH PROFILE.JS
        if(!this.state.isUserLoggedIn || this.state.userEntity === null) {
            this.setState({userEntity: JSON.parse(localStorage.getItem('userEntity'))}, () => {
                this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
                    if(this.state.isUserLoggedIn) {
                        this.retrieveQuantityInCart(() => {
                            this.retrieveCart();
                            this.setState({loaded:true});
                        });
                    } else {
                        this.setState({loaded:true});
                    }
                });
            });
        } 
        else {
            this.retrieveQuantityInCart(() => {
                this.setState({loaded:true});
            });
        }
    }

    retrieveQuantityInCart(callback) { //TODO : code redundancy
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
            this.cartService.getAmountIncart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */ (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) { // if API returned amount in cart
                    this.setState({quantityInCart: data.response}, () => {
                        if(callback) callback();
                    })
                }
                else { // otherwise, keep going
                    if(callback) callback();
                }
            })
        });
    }
    retrieveCart() {
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
            this.cartService.getCart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */ (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) {
                    this.setState({cartEntity:data.response});
                }
                else {
                    this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data);
                    this.setState({cartLoadingError:true});
                }
            });
        });
    }
    getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }

    handleAddressChange(event, value) {
        console.log("isAddressEligible ? :");
        console.log(event);
        console.log(value);
        if(value != null) {
            let approxDistanceFromCenter = value.approxMetersFromMainStorageCenter;
            if(approxDistanceFromCenter > this.state.radius.distance) {
                this.setState({addressError: true});
                this.setState({addressHelper:'Cette addresse n\'est pas éligible !'})
            }
            else if(approxDistanceFromCenter < this.state.radius.distance) {
                this.setState({addressError: false});
                this.setState({addressHelper:''})
                //TODO : Ask user for validation
                //TODO : Post new address to server
            }
        }
    }

    //TODO : Bandeau en bas "Total" (comme cdiscount) avec un lien vers 'Voir le récap' qui scrolle auto jusqu'en bas
    //TODO : Tout en bas de la page, le récap
    render() {
        const cardRootStyle = {
            display: 'flex',
            flexFlow: 'row wrap',
            alignContent: 'space-between',
            width:420,
            marginRight:'auto',
            marginLeft:'auto',
            marginBottom:'2em'
        }
       
        const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/checkout',
                slideDirection:'left',
            }
        }
        return (
            <>
                <IllicoSimpleAppBar to={previousPageRedirection} title='Livraison et paiement'/>
                {
                    this.state.isUserLoggedIn ?
                    <div>
                    {
                        this.state.cartLoadingError ?
                        <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left'}}>
                            Une erreur est survenue,
                            impossible de charger votre panier.
                            Veuillez réessayer plus tard
                            ou informer le support.
                        </Alert> 
                        :
                        <div id='checkout'>
                            <div id='items-recap'>
                            {
                                this.state.cartEntity !== null &&
                                ( 
                                    // = we atleast have one formula
                                    (this.state.cartEntity.cartFormulasByIdCart !== null &&
                                    this.state.cartEntity.cartFormulasByIdCart.length > 0)
                                    ||
                                    // or product
                                    (this.state.cartEntity.cartProductsByIdCart !== null &&
                                    this.state.cartEntity.cartProductsByIdCart.length > 0)
                                ) ?
                                <Grid container style={{marginTop:'2em'}}>
                                    <Card elevation={4} style={cardRootStyle}>
                                    {
                                        //TODO : refactor
                                        this.state.cartEntity.cartFormulasByIdCart.map(
                                            (cartFormula, index) => (
                                                <CardContent key={index}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={cartFormula.formulaByFkFormula.name}
                                                        title={cartFormula.formulaByFkFormula.name}
                                                        image={`../img/products/${cartFormula.formulaByFkFormula.picturePath}`}
                                                        style={{height:'65px'}}
                                                    />
                                                    <Badge badgeContent={cartFormula.quantity} color="primary"/>
                                                </CardContent>
                                            )
                                        )
                                    }
                                    {
                                        this.state.cartEntity.cartProductsByIdCart.map(
                                            (cartProduct, index) => (
                                                <CardContent key={index}>
                                                    <CardMedia
                                                        component="img"
                                                        alt={cartProduct.productByFkProduct.name}
                                                        title={cartProduct.productByFkProduct.name}
                                                        image={`../img/products/${cartProduct.productByFkProduct.picturePath}`}
                                                        style={{height:'65px'}}
                                                    />
                                                    <Badge badgeContent={cartProduct.quantity} color="primary"/>
                                                </CardContent>
                                            )
                                        )
                                    }
                                    </Card>
                                </Grid>
                                :
                                ''
                            }
                            </div>
                            <div id='address-area'>
                                <Typography variant='h6' style={{ marginTop:'0.3em', color:'#b26a00', marginBottom:'0.5em'}}>
                                    Votre addresse de livraison :
                                </Typography>
                                {
                                    this.state.userEntity !== null &&
                                    this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation !== null
                                    && this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress !== null ?

                                    <div id='address-display'>
                                        <Typography variant='body1' id='identity'>
                                        {
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.firstname + ' ' +
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.surname.toUpperCase()
                                        }
                                        </Typography>
                                        <Typography variant='body1' id='postal-address'>
                                        {
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.streetNumber + ' ' +
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.street + ', ' +                                 
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.city
                                        }
                                        </Typography>
                                        <Typography variant='body1' id='phone'>
                                        {
                                            this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.phone
                                        }
                                        </Typography>
                                    </div>
                                    :
                                    ''
                                }
                                <div id='address-change'>
                                <Typography variant='h6' style={{ marginTop:'0.3em', color:'#b26a00', marginBottom:'0.5em'}}>
                                    Changer d'addresse :
                                </Typography>
                                <FormControl style={{width:'300px'}}>
                                    <IllicoAddresses addressHelper={this.state.addressHelper} addressError={this.state.addressError} onChange={this.handleAddressChange} />
                                </FormControl>
                                </div>
                            </div>
                            
                            <div id='payment'>
                                <div id='stripe'>
                                {/** //intégration du bandeau stripe / apple pay / google pay */}    
                                </div>
                                <div id='paypal'>
                                    {/** // intégration du payement paypal + paypal CB */}
                                </div>
                            </div>

                            <div id='floating-price-recap'>
                                {/** //todo : ici le recap de prix qui s'affiche en tant que bottom bar */}
                            </div>

                            <div id='fixed-price-recap'>
                                {/** //todo : ici le recap de prix fixé tout en bas de la page */}
                            </div>
                        </div>
                    }
                    </div>
                    :
                    <IllicoAskForConnection loginRedirectState={loginRedirectState}/>
                }
                
            </>
        )
    }
}