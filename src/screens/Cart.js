import React from 'react'
import IllicoBottomNavigation from '../components/IllicoBottomNavigation';
import IllicoTopNavigation from '../components/IllicoTopNavigation';
import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse';
import IllicoAskForConnection from '../components/IllicoAskForConnection';
import CartService from '../network/services/CartService';
import { Alert } from '@material-ui/lab';
import CartEntity from '../models/CartEntity';
import { Card, CardContent, CardMedia, CircularProgress, Grid, MenuItem, Select, Typography } from '@material-ui/core';
import FrontEndLogService from '../network/services/FrontEndLogService';
import FormulaEntity from '../models/FormulaEntity';
import ProductEntity from '../models/ProductEntity';
import CartFormulasEntity from '../models/assignation/CartFormulasEntity';
import CartProductsEntity from '../models/assignation/CartProductsEntity';

export default class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            bottomNavigationValue: 2,
            isUserLoggedIn: false,
            /** @type {UserEntity} userEntity */
            userEntity:null,
            /** @type {CartEntity} cartEntity*/
            cartEntity:null,
            cartLoadingError:false
        }
        this.cartService = new CartService();
        this.frontEndLogService = new FrontEndLogService();
    }

    //TODO : Code redundancy between Profile.js, Cart.js, Category.js, Home.js
    retrieveQuantityInCart(callback) {
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
            this.cartService.getAmountIncart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */ (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) { // if API returned amount in cart
                    this.setState({quantityInCart: data.response}, () => {
                        callback();
                    })
                }
                else { // otherwise, keep going
                    callback();
                }
            })
        });
    }

    retrieveCart() {
        this.cartService.getCart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */ (data) => {
            if(data.status === ApiResponse.GET_SUCCESS()) {
                console.log(data);
                this.setState({cartEntity:data.response});
            }
            else {
                this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data);
                this.setState({cartLoadingError:true});
            }
        });
    }

    //TODO : CODE REDUNDANCY WITH PROFILE.JS
    componentDidMount() {
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

    //TODO : refactor, redundant
    getUserIdIfLoggedInOtherwiseMinus1() {
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }

    /** @param {CartFormulasEntity} cartFormula */
    handleCartFormulaChange(event, cartFormula) {
        let qty = event.target.value;
        let oldQuantity = cartFormula.quantity;
        if(qty === 0) {
            //Display popup do you want to remove from cart ?
        }
        else if(qty > 0 && qty < 11) {
            // change qty on server side + display loading meanwhile + 'quantity changed ✅' alert
        }
        else {
            // do not update anything + show error ❌ alert.
        }
    }

    render() {
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/cart',
                slideDirection:'left',
            }
        }
        const cardRootStyle = {
            display:'flex',
            width:400
        }
        const cardDetailsStyle = {
            display:'flex',
            flexDirection:'column',
            textAlign:'left',
            position:'relative'
        }
        const cardContentStyle = {
            flex: '1 0 auto'
        }
        const cardImageStyle = {
            width:200,
            aspectRatio:1/1,
        }

        return (
            <div>
                <IllicoTopNavigation title='Panier' backUrl='/profile' isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
                {
                    this.state.isUserLoggedIn ?
                    <div>
                        {/* displays an error in case of cart loading error. */}
                        {
                            this.state.cartLoadingError ?
                            <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left', fontFamily:'Tisa'}}>
                                Une erreur est survenue,
                                impossible de charger votre panier.
                                Veuillez informer le support.
                            </Alert> : ''
                        }
                        {
                            this.state.cartEntity !== null ?
                            <div>
                                {/** LES FORMULES */}
                                {
                                    this.state.cartEntity.cartFormulasByIdCart !== null &&
                                    this.state.cartEntity.cartFormulasByIdCart.length > 0 ?
                                    <div>
                                        <div>
                                            <Typography style={{marginTop:'1em'}}>
                                                Vos formules
                                            </Typography>
                                        </div>
                                        <Grid container spacing={3}>
                                        {
                                            this.state.cartEntity.cartFormulasByIdCart.map(
                                                /** @param {CartFormulasEntity} cartFormula */
                                                (cartFormula, index) => (
                                                    <div key={index} style={{marginLeft: 'auto', marginRight: 'auto', marginTop:'1em', marginBottom:'1em'}}>
                                                        <Card key={index} elevation={3} style={cardRootStyle}>
                                                            <CardMedia
                                                                component="img"
                                                                alt={this.props.image}
                                                                title={this.props.title}
                                                                image={`../img/products/${cartFormula.formulaByFkFormula.picturePath}`}
                                                                style={cardImageStyle}
                                                            />
                                                            <CardContent style={cardDetailsStyle}>
                                                                {cartFormula.formulaByFkFormula.name}
                                                                <div style={{position:'absolute', bottom:5}}>
                                                                    <div>
                                                                        <Select
                                                                            labelId={`${cartFormula.formulaByFkFormula.name}-label`}
                                                                            id={cartFormula.formulaByFkFormula.idFormula}
                                                                            value={cartFormula.quantity}
                                                                            onChange={(event) => this.handleCartFormulaChange(event, cartFormula)}
                                                                        >
                                                                           {/* //TODO : REPLACE MAX QTY (10) WITH CONSTANT */}
                                                                           {[...Array(10)].map((x, i) => 
                                                                                <MenuItem key={i} value={i} style={{
                                                                                    paddingTop:'2px', minHeight:0, width:'60px'
                                                                                }}>{i}</MenuItem>
                                                                            )}
                                                                        </Select>
                                                                        {/**  //TODO dropdown 1 à 10 + 0 (supprimer) + bin icon delete */}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                            ))
                                        }
                                        </Grid>
                                    </div>
                                    : ''
                                }

                                {/** LES PRODUITS */}
                                {
                                    this.state.cartEntity.cartProductsByIdCart !== null &&
                                    this.state.cartEntity.cartProductsByIdCart.length > 0 ?
                                    <div>
                                        <div>
                                            <Typography style={{marginTop:'3em'}}>
                                                Vos produits
                                            </Typography>
                                        </div>
                                        <Grid container spacing={3}>
                                        {
                                            this.state.cartEntity.cartProductsByIdCart.map(
                                                /** @param {CartProductsEntity} cartProduct */
                                                (cartProduct, index) => (
                                                    <div key={index} style={{marginLeft: 'auto', marginRight: 'auto', marginTop:'1em'}}>
                                                        <Card key={index} elevation={3}>
                                                            {cartProduct.productByFkProduct.name}
                                                        </Card>
                                                    </div>
                                            ))
                                        }
                                        </Grid>
                                    </div>
                                    : ''
                                }
                            </div>
                            :
                            <div style={{marginBottom:'5em', marginTop:'1em'}}>
                                <CircularProgress/>
                            </div>
                        }
                    </div>
                    :
                    <IllicoAskForConnection loginRedirectState={loginRedirectState}/>
                }
                <IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart}/>
            
            </div>

            
        )
    }
}
