import React from 'react'
import Slide from '@material-ui/core/Slide';
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import { Badge, Card, CardContent, CardMedia, Grid, Paper } from '@material-ui/core';
import CartEntity from '../models/CartEntity';
import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse';
import CartService from '../network/services/CartService';
import FrontEndLogService from '../network/services/FrontEndLogService';
import IllicoAskForConnection from '../components/IllicoAskForConnection';
import { Alert } from '@material-ui/lab';

export default class Checkout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isUserLoggedIn: false,
            /**@type UserEntity */
            userEntity: null,
            quantityInCart: 0,
            /** @type {CartEntity} cartEntity */
            cartEntity:null,
            cartLoadingError:false
        }
        this.cartService = new CartService();
        this.frontEndLogService = new FrontEndLogService();
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
                            <div id='recap'>
                                <div id='items-recap'>
                                    Recap articles images carroussel + quantity badge
                                    {
                                        this.state.cartEntity !== null &&
                                        this.state.cartEntity.cartFormulasByIdCart !== null &&
                                        this.state.cartEntity.cartFormulasByIdCart.length > 0 ?
                                        <Grid container spacing={3}>
                                        <Card elevation={4} style={cardRootStyle}>
                                        {
                                            //todo : refactor
                                            this.state.cartEntity.cartFormulasByIdCart.map(
                                                (cartFormula, index) => (
                                                    
                                                        <CardContent>
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
                                                    
                                                        <CardContent>
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
                                <div id='price-recap'>
                                    Articles : (bold)
                                    1 x TrucMuche   10€
                                    3 x Autre       15€
                                    Livraison (bold) :   x.xx€
                                    Total (bold, big) : 25€ (orange, bold)
                                </div>
                            </div>

                            <div id='address'>
                                Votre addresse de livraison :
                                
                                <div id='address-change'>
                                    Changer d'addresse
                                </div>
                            </div>
                            
                            <div id='payment'>
                                <div id='card'>
                                </div>
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