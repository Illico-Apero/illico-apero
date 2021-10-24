import React from 'react'
import { Alert } from '@material-ui/lab';
import { CircularProgress, Dialog, DialogActions, DialogContentText, DialogTitle, Snackbar, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import FrontEndLogService from '../network/services/FrontEndLogService';
import CartFormulasEntity from '../models/assignation/CartFormulasEntity';
import CartProductsEntity from '../models/assignation/CartProductsEntity';
import CartEntity from '../models/CartEntity';
import CartService from '../network/services/CartService';
import ApiResponse from '../models/api/ApiResponse';

import yellow_circle from '../assets/design/geometry/yellow_circles_small.png';
import blue_bubble from '../assets/design/geometry/blue_bubble.png';
import IllicoCartItem from '../components/IllicoCartItem';
import IllicoAudio from '../utils/IllicoAudio';
import Utils from '../utils/Utils';

import IllicoAskForConnection from '../components/IllicoAskForConnection';
import IllicoBottomNavigation from '../components/IllicoBottomNavigation';
import IllicoTopNavigation from '../components/IllicoTopNavigation';
import { Button } from 'bootstrap';
import RemovalInformations from '../models/RemovalInformations';


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
            cartLoadingError:false,
            quantityUpdated:false,
            quantityUpdatedText:'Panier mis à jour 🍻✅ !',
            isRemoveItemDialogOpen:false,
            /** @type {RemovalInformations} removalInformations */
            removalInformations:null
        }
        this.cartService = new CartService();
        this.frontEndLogService = new FrontEndLogService();
        this.onQuantityChange = this.onQuantityChange.bind(this);
    }

    //TODO : Code redundancy between Profile.js, Cart.js, Category.js, Home.js
    //TODO : idea to test : inherit from a component that will have this method, and bind it to child ? idk
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


    /** @param {CartFormulasEntity} cartFormula */
    onQuantityChange(event, item, itemIndex, isItemCartFormula) {
        let newQty = event.target.value;
        if(newQty === 0) {
            let currentRemovalInformations = new RemovalInformations(this.state.cartEntity, itemIndex, isItemCartFormula);
            this.setState({removalInformations: currentRemovalInformations});
            // this will show the cancel/remove item dialog. If dialog is "accepted",
            // the handleRemoveFromCartAccept() is called, and will use the removalInformations.
            this.setState({isRemoveItemDialogOpen: true}); 
        }
        else if(newQty > 0 && newQty < 11) {
            let cart = this.state.cartEntity;
            if(isItemCartFormula) {
                cart.cartFormulasByIdCart[itemIndex].quantity = newQty;
            }
            else {
                cart.cartProductsByIdCart[itemIndex].quantity = newQty;
            }
            this.updateCartQuantity(cart)
        }
        else {
            //TODO do not update anything + show error ❌ snack.
            // leave qty of card to oldQuantity
        }
    }

    saveCartAndUpdatePrice(cart) {
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
            this.cartService.saveCart(this.state.userEntity, cart, this.state.userEntity.jwt, (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) {
                    this.setState({cartPrice:4});
                    console.log("cart $$$ :")
                    console.log(data.response);
                    cart.totalPrice = data.response;
                    this.setState({cartEntity:cart});
                    this.setState({quantityUpdated:true});
                    IllicoAudio.playTapAudio();
                }
                else {
                    // TODO show error snack
                }
            });
        });
    }

    //TODO : 1) End quantity update (snacks + bin to remove + update price (do not duplicate code)) 
    //       2) Add total price + checkout box
    //       3) develop checkout page + start stripe payment 

    //TODO : refactor, redundant
    getUserIdIfLoggedInOtherwiseMinus1() {
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }
    handleCloseQuantityUpdatedAlert(event, reason) {
        if (reason === 'clickaway') {
            
            return;
        }
        IllicoAudio.playTapAudio();
        this.setState({quantityUpdated : false});
    }
    handleCloseRemoveItemDialog() {
        this.setState({isRemoveItemDialogOpen:false});
        IllicoAudio.playUiLockAudio();
    }
    handleRemoveFromCartAccept() {
        //todo : remove selected item from cart + show alert dialog
        IllicoAudio.playTapAudio();
    }
    handleRemoveFromCartCancel() {

    }


    render() {
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/cart',
                slideDirection:'left',
            }
        }


        //TODO : Dropown management, Qty management server side, No more than 10 server side, No more than 10 Home/Category,
        //       Typography should be better (Formules, produits, card title), bin to remove item, checkout at first line with total price indicated
        return (
            <>
                <IllicoTopNavigation title='Panier' backUrl='/profile' isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
                {
                    
                    this.state.isUserLoggedIn ?
                    <div id='cart'> {
                            this.state.cartLoadingError ?
                            <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left', fontFamily:'Tisa'}}>
                                Une erreur est survenue,
                                impossible de charger votre panier.
                                Veuillez informer le support.
                            </Alert> 
                            : 
                            ''
                        }{
                            this.state.cartEntity !== null ?
                            <div style={{marginBottom:'5em'}}> {
                                this.state.cartEntity.cartFormulasByIdCart.length === 0 && this.state.cartEntity.cartProductsByIdCart.length === 0 ?
                                <MuiAlert severity='info'>Votre panier est vide 😭 !</MuiAlert>
                                :
                                <div id='formulas'> {
                                    this.state.cartEntity.cartFormulasByIdCart !== null &&
                                    this.state.cartEntity.cartFormulasByIdCart.length > 0 ?
                                    <>
                                        <Typography variant='h5' style={{marginTop:'1em', fontFamily:'Tisa', marginBottom:'0.5em', color:'#b26a00'}}>
                                            Vos formules {' '}
                                            <img src={yellow_circle} alt='yellow geometric circles' style={{height:'0.7em'}}/>
                                        </Typography> {
                                            this.state.cartEntity.cartFormulasByIdCart.map(
                                            /** @param {CartFormulasEntity} cartFormula */
                                            (cartFormula, index) => (
                                                <IllicoCartItem
                                                    onQuantityChange={this.onQuantityChange}
                                                    isCartFormula
                                                    item={cartFormula}
                                                    index={index}
                                                    key={index}
                                                    
                                                />
                                            ))
                                        }
                                    </>
                                    : 
                                    ''
                                }
                                {''}
                                
                                <div id='products'> {
                                    this.state.cartEntity.cartProductsByIdCart !== null &&
                                    this.state.cartEntity.cartProductsByIdCart.length > 0 ?
                                    <>
                                        <Typography variant='h5' style={{marginTop:'2em', fontFamily:'Tisa', marginBottom:'0.5em', color:'#b26a00'}}>
                                            Vos produits {' '}
                                            <img src={blue_bubble} alt='blue geometric circle' style={{height:'0.7em'}}/>
                                        </Typography> {
                                            this.state.cartEntity.cartProductsByIdCart.map(
                                                /** @param {CartProductsEntity} cartProduct */
                                                (cartProduct, index) => (
                                                    <IllicoCartItem
                                                        onQuantityChange={this.onQuantityChange}
                                                        item={cartProduct}
                                                        index={index}
                                                        key={index}
                                                    />
                                            ))
                                        }
                                    </>
                                    : 
                                    ''
                                }
                                </div>
                            </div>
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
            
                <div id='dialogs'>
                    <Snackbar style={{marginBottom:'3.5em'}} open={this.state.quantityUpdated} autoHideDuration={1500} onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)}>
                        <MuiAlert onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)} severity="success">
                            {this.state.quantityUpdatedText}
                        </MuiAlert>
                    </Snackbar>


                    <Dialog onClose={() => this.handleCloseRemoveItemDialog()} aria-labelledby="delete-cart-item-title" open={this.state.isRemoveItemDialogOpen}>
                        <DialogTitle id="delete-cart-item-title">Supprimer l'article du panier ?</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => this.handleRemoveFromCartCancel()} color="primary"> Annuler </Button>
                            <Button onClick={() => this.handleRemoveFromCartAccept()} color="primary" autoFocus> Supprimer </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </>
        )
    }
}
