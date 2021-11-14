import React from 'react'
import { Alert } from '@material-ui/lab';
import { CircularProgress, Dialog, DialogActions, Button, DialogTitle, Snackbar, Typography, Card } from '@material-ui/core';
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
import RemovalInformations from '../models/RemovalInformations';
import NoDecorationLink from '../components/Generic/NoDecorationLinkClass';


export default class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            quantityInCart:0,
            bottomNavigationValue: 2,
            isUserLoggedIn: false,
            /** @type {UserEntity} userEntity */
            userEntity:null,
            /** @type {CartEntity} cartEntity*/
            cartEntity:null,
            cartLoadingError:false,
            isQuantityUpdatedAlertOpen:false,
            quantityUpdatedText:'Panier mis à jour 🍻✅ !',
            isQuantityUpdatedErrorAlertOpen:false,
            quantityUpdateErrorText:'Impossible de sauvegarder la quantité ❌. Contactez le support.',
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

    onQuantityChange(event, item, itemIndex, isItemCartFormula) {
        let newQty;
        if(event) {
            newQty = event.target.value;
        }
        else {
            newQty = 0;
        }
        if(newQty === 0) {
            let currentRemovalInformations = new RemovalInformations(this.state.cartEntity, itemIndex, isItemCartFormula);
            this.setState({removalInformations: currentRemovalInformations}, () => {
                // this will show the cancel/remove item dialog. If dialog is "accepted",
                // the handleRemoveFromCartAccept() is called, and will use the removalInformations.
                this.setState({isRemoveItemDialogOpen: true}); 
            })
        }
        else if(newQty > 0 && newQty < 11) {
            let cart = this.state.cartEntity;
            if(isItemCartFormula) {
                cart.cartFormulasByIdCart[itemIndex].quantity = newQty;
            }
            else {
                cart.cartProductsByIdCart[itemIndex].quantity = newQty;
            }
            this.saveCartAndUpdatePrice(cart)
        }
        else {
            IllicoAudio.playAlertAudio();
            this.setState({isQuantityUpdatedErrorAlertOpen:true});
            this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), "Tried to update cart with invalid quantity");
        }
    }

    /**
     * 
     * @param {CartEntity} cart 
     */
    saveCartAndUpdatePrice(cart) {
        Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
            this.cartService.saveCart(this.state.userEntity, cart, this.state.userEntity.jwt, (data) => {
                if(data.status === ApiResponse.GET_SUCCESS()) {
                    cart.totalPrice = data.response;
                    this.setState({cartEntity:cart}, () => {
                        this.retrieveQuantityInCart(()=>{});
                        console.log(this.state.cartEntity)
                    });
                    this.setState({isQuantityUpdatedAlertOpen:true});
                }
                else {
                    IllicoAudio.playAlertAudio();
                    this.setState({isQuantityUpdatedErrorAlertOpen:true});
                    this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data.response);
                }
            });
        });
    }

    //TODO Add cart recap (price) + delete bin + develop checkout page + start stripe payment 

    
    getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }
    handleCloseQuantityUpdatedAlert(event, reason) { //TODO : refactor, redundant
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isQuantityUpdatedAlertOpen:false});
    }
    handleCloseQuantityUpdateErrorAlert(event, reason) { //TODO : refactor, redundant
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isQuantityUpdatedErrorAlertOpen:false});
    }
    handleCloseRemoveItemDialog(even, reason) { //TODO : refactor, redundant
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isRemoveItemDialogOpen:false});
        IllicoAudio.playUiLockAudio();
    }
    handleRemoveFromCartAccept() {
        this.setState({isRemoveItemDialogOpen:false});
        let cart = this.state.cartEntity;
        let removalInformations = this.state.removalInformations;
        if(removalInformations.isItemCartFormula) {
            delete this.state.cartEntity.cartFormulasByIdCart[removalInformations.itemIndex];
        }
        else {
            delete this.state.cartEntity.cartProductsByIdCart[removalInformations.itemIndex];
        }
        this.saveCartAndUpdatePrice(cart)
        IllicoAudio.playUiLockAudio();
    }
    handleRemoveFromCartCancel() {
        this.setState({isRemoveItemDialogOpen : false});
        IllicoAudio.playUiLockAudio();
    }    

    render() {
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/cart',
                slideDirection:'left',
            }
        }
        const checkoutRedirectState = {
            pathname:'/checkout',
            state: {
                backUrl:'/cart',
                slideDirection:'left'
            }
        }
        const checkoutRootStyle = {
            display:'flex',
            width:200,
            marginRight:'auto',
            marginLeft:'auto',
            marginBottom:'2em',
            padding:'1em',
            textAlign:'left'
        }
        return (
            <>
                <IllicoTopNavigation title='Panier' backUrl='/profile' isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
                {
                    this.state.isUserLoggedIn ?
                    <div id='cart'> {
                        this.state.cartLoadingError ?
                        <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left'}}>
                            Une erreur est survenue,
                            impossible de charger votre panier.
                            Veuillez réessayer plus tard
                            ou informer le support.
                        </Alert> 
                        : 
                        ''
                        }{
                        this.state.cartEntity !== null ?
                        <div style={{marginBottom:'5em'}}> {
                            (this.state.cartEntity.cartFormulasByIdCart.length === 0 && this.state.cartEntity.cartProductsByIdCart.length === 0) ||
                            (this.state.cartEntity.cartFormulasByIdCart.every(item => !item) && this.state.cartEntity.cartProductsByIdCart.every(item => !item)) ?
                            <Alert severity="info" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left'}}>
                                Votre panier est vide 😭 !
                            </Alert> 
                            :
                            <div id="cart">

                                <div id="checkout" style={{marginTop:'2em', marginBottom:'1em'}}>
                                    <Card elevation={3} style={checkoutRootStyle}>
                                    <div style={{paddingRight:'0.5em', marginTop:'10px'}}>
                                        <Typography>
                                        Total
                                        </Typography>
                                        <Typography variant='body1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00',  fontSize:'0.8em', marginBottom:'0.3em'}}>
                                            {this.state.cartEntity.totalPrice.toFixed(2)}€
                                        </Typography>
                                    </div>
                                    <div style={{marginLeft:'1em'}}>
                                        <NoDecorationLink to={checkoutRedirectState}>
                                            <Button onClick={() => IllicoAudio.playTapAudio()} variant='contained' color='primary' style={{fontWeight:'bold'}}>
                                                Livraison et paiement
                                            </Button>
                                        </NoDecorationLink>
                                    </div>
                                    </Card>
 
                                </div>


                                <div id='formulas'> {
                                    this.state.cartEntity.cartFormulasByIdCart !== null &&
                                    this.state.cartEntity.cartFormulasByIdCart.length > 0 &&
                                    !this.state.cartEntity.cartFormulasByIdCart.every(item => !item)?
                                    <>
                                        <Typography variant='h5' style={{marginTop:'1em', marginBottom:'0.5em', color:'#b26a00'}}>
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
                                </div>
                                
                                <div id='products'> {
                                    this.state.cartEntity.cartProductsByIdCart !== null &&
                                    this.state.cartEntity.cartProductsByIdCart.length > 0 &&
                                    !this.state.cartEntity.cartProductsByIdCart.every(item => !item) ?
                                    <>
                                        <Typography variant='h5' style={{marginTop:'2em',marginBottom:'0.5em', color:'#b26a00'}}>
                                            Vos Boissons {' '}
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
                    <Snackbar style={{marginBottom:'3.5em'}} open={this.state.isQuantityUpdatedAlertOpen} autoHideDuration={1500} onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)}>
                        <MuiAlert onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)} severity="success">
                            {this.state.quantityUpdatedText}
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar style={{marginBottom:'3.5em'}} open={this.state.isQuantityUpdatedErrorAlertOpen} autoHideDuration={5000} onClose={(event, reason) => this.handleCloseQuantityUpdateErrorAlert(event, reason)}>
                        <MuiAlert onClose={(event, reason) => this.handleCloseQuantityUpdateErrorAlert(event, reason)} severity="error">
                            {this.state.quantityUpdateErrorText}
                        </MuiAlert>
                    </Snackbar>


                    <Dialog onClose={(event, reason) => this.handleCloseRemoveItemDialog(event, reason)} aria-labelledby="delete-cart-item-title" open={this.state.isRemoveItemDialogOpen}>
                        <DialogTitle id="delete-cart-item-title">Supprimer l'article du panier ?</DialogTitle>
                        <DialogActions>
                            <Button variant='contained' color='primary' onClick={() => this.handleRemoveFromCartCancel()}> Annuler </Button>
                            <Button variant='contained' color='secondary' onClick={() => this.handleRemoveFromCartAccept()} autoFocus> Supprimer </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </>
        )
    }
}
