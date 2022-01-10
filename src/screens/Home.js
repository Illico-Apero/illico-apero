import React from 'react'
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import MuiAlert from '@material-ui/lab/Alert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import UserEntity from '../models/UserEntity';
import FormulaEntity from '../models/FormulaEntity';
import FormulaService from '../network/services/FormulaService';
import ProductService from '../network/services/ProductService';
import ApiResponse from '../models/api/ApiResponse';
import FrontEndLogService from '../network/services/FrontEndLogService';
import Utils from '../utils/Utils';

import IllicoCategory from '../components/IllicoCategory';
import IllicoFormula from '../components/IllicoFormula';
import IllicoChip from '../components/IllicoChip';

import yellow_circle from '../assets/design/geometry/yellow_circles_small.png';
import blue_bubble from '../assets/design/geometry/blue_bubble.png';
import IllicoBottomNavigation from '../components/IllicoBottomNavigation';

import IllicoAudio from '../utils/IllicoAudio';
import CartService from '../network/services/CartService';
import UserService from '../network/services/UserService';
import IllicoTopNavigation from '../components/IllicoTopNavigation';
import { Link } from 'react-router-dom';

//TODO : Stock handling (Formula (home.js) & products (category.js))
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            bottomNavigationValue: 1,
            isUserLoggedIn: false,
            /**@type UserEntity */
            userEntity: null,
            /**@type Array<String> */
            categories: null,
            /**@type Array<FormulaEntity> */
            formulas: null,
            generalMenuAnchor:null,
            profileMenuAnchor:null,
            quantityInCart: 0,
            addedToCartAlert:false,
            addedToCartMessage:"Formule ajoutée au panier 🍻 !",
            isNotLoggedInDialogOpen:false,
            isAddToCartErrorAlertOpen:false,
            addToCartErrorAlertText:"Impossible d'ajouter au panier ❌. Contactez le support.",
            isAddMoreThan9itemsWarningAlertOpen:false,
            addMoreThan9itemsWarningAlert:"Impossible de dépasser la quantité autorisée (9 max)",
            homeLoadingError:false
        }

        this.productService = new ProductService();
        this.formulaService = new FormulaService();
        this.cartService = new CartService();
        this.userService = new UserService();
        this.frontEndLogService = new FrontEndLogService();

        this.initializeCategories();
        this.initializeFormulas();
    }

    initializeCategories() {
        this.productService.getCategories( 
            /** @param {ApiResponse} data */
            (data) => {
            if(data.status === ApiResponse.GET_SUCCESS()) {
                this.setState({categories: data.response})
            }
            else if(data.status === ApiResponse.GET_ERROR()) {
                this.setState({homeLoadingError:true});
                console.error(data.response);
                let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
                this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
            }
        });
    }
    initializeFormulas() {
        this.formulaService.getFormulas( 
            /** @param {ApiResponse} data */
            (data) => {
            if(data.status === ApiResponse.GET_SUCCESS()) {
                this.setState({formulas: data.response})
            }
            else if(data.status === ApiResponse.GET_ERROR()) {
                this.setState({homeLoadingError:true});
                console.error(data.response);
                let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
                this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
            }
        });
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
    handleCloseAddedToCartAlert(event, reason) { //TODO : redundant, pass bool to change as param
        if (reason === 'clickaway') {
            
            return;
        }
        this.setState({addedToCartAlert : false});
    }
    handleCloseAddToCartErrorAlert(event, reason) { //TODO : redundant, pass bool to change as param
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isAddToCartErrorAlertOpen : false});
    }
    handleCloseAddMoreThan9itemsWarningAlert(event, reason) { //TODO : redundant, pass bool to change as param
        if (reason === 'clickaway') {
            return;
        }
        this.setState({isAddMoreThan9itemsWarningAlertOpen : false});
    }
    handleCloseNotLoggedInDialog() {//TODO : redundant, pass bool to change as param
        this.setState({isNotLoggedInDialogOpen:false});
        IllicoAudio.playUiLockAudio();
    }
    handleDialogSignInClick() {//TODO : redundant, pass bool to change as param
        IllicoAudio.playTapAudio(); //TODO : is it working ? test when not connected
    }
    handleDialogSignUpClick() {//TODO : redundant, pass bool to change as param
        IllicoAudio.playTapAudio(); //TODO : is it working ? test when not connected
    }

    addFormulaToCart(formula) {
        if(this.state.isUserLoggedIn) {
            Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
                if(refreshedUserEntity !== null) {
                    this.setState({userEntity: refreshedUserEntity});
                    this.cartService.addFormulaToCart(formula, refreshedUserEntity.jwt, (data) => {
                        if(data.status === ApiResponse.GET_SUCCESS()) {
                            this.handleUiRefreshAfterFormulaSuccessfullyAddedToCart();
                        }
                        else if(data.status === ApiResponse.GET_WARNING()) {
                            this.setState({isAddMoreThan9itemsWarningAlertOpen:true});
                        }
                        else {
                            this.setState({isAddToCartErrorAlertOpen:true});
                            this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data.response);
                        }
                    });
                }
                else {
                    this.setState({isAddToCartErrorAlertOpen:true});
                    this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), this.state.userEntity);
                }
            });
        }
        else {
            this.setState({isNotLoggedInDialogOpen:true});
            IllicoAudio.playAlertAudio();
        }
    }
    handleUiRefreshAfterFormulaSuccessfullyAddedToCart() {
        this.setState({quantityInCart: this.state.quantityInCart + 1}); // no need to call the server for this, it's just local information anyways, that will be retrieved onLoad.
        this.setState({addedToCartAlert:true}, () => {
            IllicoAudio.playAddToCartAudio();
        });
    }
    getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }
    componentDidMount() {
        // many callbacks cause setstate is async. By doing this, we are sure that local storage user is well loaded before component gets rendered.
        this.setState({userEntity: JSON.parse(localStorage.getItem('userEntity'))}, () => {
            this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
                if(this.state.isUserLoggedIn) {
                    this.retrieveQuantityInCart(() => {
                        this.setState({loaded:true});
                    });
                } else {
                    this.setState({loaded:true});
                }
            });
        });
    }
    getCategoryRedirectState(category) {
        return  {
            pathname: '/category',
            state: {
                backUrl:'/home',
                category:category,
                isUserLoggedIn:this.state.isUserLoggedIn,
                userEntity:this.state.userEntity
            }
        }
    }

/** //TODO : Indiquer que le site utilise des cookies via une popup par dessus en bas à droite (cf screen bureau) + enregistrer le choix (localstorage ?) 
 * Cookies - indiquer que ceux d'illico sont nécessaires au bon fonctionnement du site et ne sont divulgués à quiconque
 */

    render() {
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/home',
                slideDirection:'left',
            }
        }
        const registerRedirectState = {
            pathname: '/register',
            state: {
                backUrl:'/home',
                slideDirection:'left'
            }
        }
        if(!this.state.loaded && !this.state.categories && ! this.state.formulas) {
            return (                      
                <div>
                    <CircularProgress/>
                </div>
            );
        }
        return (
            <div>
                <IllicoTopNavigation showLogo backUrl={"/home"} isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity}/>
                <Slide direction='up' in={this.state.loaded} mountOnEnter unmountOnExit timeout={400}>
                    <div>
                        {/* TODO : affichage du catalogue, du menu en bas, etc. voir maquette. Si connecté, afficher certains trucs en + ? */ }

                        { /************************** CATEGORIES **************************/}

                        <div id="categories">
                            <Typography variant='h4' gutterBottom style= {{ paddingTop:'0.3em', color:'#b26a00', marginBottom:'1em'}}>
                                NOS CATÉGORIES {' '}
                            <img src={yellow_circle} alt='yellow geometric circles' style={{
                                height:'0.7em'
                            }}/>
                            </Typography>
                            {
                                this.state.categories !== null ?   
                                <Grid container>
                                {
                                    this.state.categories.map((category, index) => (
                                        <Grid key={index} item xs>
                                            <Typography variant='subtitle1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00'}}>
                                                <div onClick={() => IllicoAudio.playNavigationForwardAudio()}>
                                                    <IllicoChip text={Utils.getCategoryPluralWith_LES_inFrontAndEmoji(category)} color='primary' to={this.getCategoryRedirectState(category)}/>
                                                </div>
                                            </Typography>
                                            <div onClick={() => IllicoAudio.playNavigationForwardAudio()}>
                                                <IllicoCategory image={category} to={this.getCategoryRedirectState(category)}/>
                                            </div>
                                        </Grid>
                                    ))
                                }
                                </Grid>
                                : 
                                <div>
                                    <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left'}}>
                                        Une erreur est survenue,
                                        impossible de contacter le serveur pour charger la page.
                                        Veuillez réessayer plus tard
                                        ou informer le support.
                                    </Alert> 
                                </div>
                            }
                        </div>

                        <div style={{marginTop:'4em'}}/>
                        <Divider variant="middle" />
                        <div style={{marginBottom:'4em'}}/>


                        { /************************** FORMULAS **************************/}

                        <div id="formules">
                            <Typography variant='h4' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', marginBottom:'1em'}}>
                                NOS FORMULES {' '}
                                <img src={blue_bubble} alt='blue geometric circle' style={{
                                height:'0.7em'
                            }}/>
                            </Typography>
                            {
                                this.state.formulas !== null ?   
                                <div style= {{marginBottom:'5em'}}>
                                {
                                    <Grid container>
                                    {
                                        this.state.formulas.map(
                                            /**
                                            * 
                                            * @param {FormulaEntity} item 
                                            * @param {Number} index 
                                            * @returns some content 
                                            */
                                            (formula, index) => (
                                            <Grid key={index} item xs>
                                                {/* TODO : HANDLE ADD TO BASKET FUNCTION + DISPLAY ANIMATION + DISPLAY '1', '2', etc. close to 'Panier' like notifications */}
                                                <IllicoFormula image={formula.picturePath} title={formula.name} description={formula.description} price={formula.price}
                                                onBasketAddClick={() => this.addFormulaToCart(formula)}/>
                                            </Grid>
                                        ))
                                    }
                                    </Grid>
        
                                }
                                </div>
                                : <div style={{marginBottom:'5em'}}>
                                    <CircularProgress/>
                                </div>
                            }
                        </div>
                    </div>
                </Slide>

                <div>
                {
                    !this.state.loaded ? 
                    <div style={{marginBottom:'5em'}}>
                        <CircularProgress/>
                    </div>
                    : ''
                }
                </div>
                <IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart} />  
            

                {/* Snackbars and alerts */}
                <Snackbar style={{marginBottom:'3.5em'}} open={this.state.addedToCartAlert} autoHideDuration={1500} onClose={(event, reason) => this.handleCloseAddedToCartAlert(event, reason)}>
                    <MuiAlert onClose={(event, reason) => this.handleCloseAddedToCartAlert(event, reason)} severity="success">
                        {this.state.addedToCartMessage}
                    </MuiAlert>
                </Snackbar>
                <Snackbar style={{marginBottom:'3.5em'}} open={this.state.isAddToCartErrorAlertOpen} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseAddToCartErrorAlert(event, reason)}>
                    <MuiAlert onClose={(event, reason) => this.handleCloseAddToCartErrorAlert(event, reason)} severity="error">
                        {this.state.addToCartErrorAlertText}
                    </MuiAlert>
                </Snackbar>
                <Snackbar style={{marginBottom:'3.5em'}} open={this.state.isAddMoreThan9itemsWarningAlertOpen} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseAddMoreThan9itemsWarningAlert(event, reason)}>
                    <MuiAlert onClose={(event, reason) => this.handleCloseAddMoreThan9itemsWarningAlert(event, reason)} severity="warning">
                        {this.state.addMoreThan9itemsWarningAlert}
                    </MuiAlert>
                </Snackbar>
                <Dialog onClose={() => this.handleCloseNotLoggedInDialog()} aria-labelledby="not-logged-in-dialog-title" open={this.state.isNotLoggedInDialogOpen}>
                    <DialogTitle id="not-logged-in-dialog-title">Vous devez être connecté(e) 😋 !</DialogTitle>
                        <List>
                            <ListItem button component={Link} to={loginRedirectState} onClick={() => this.handleDialogSignInClick()}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AccountCircleIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Se connecter"/>
                            </ListItem>

                            <ListItem button component={Link} to={registerRedirectState} onClick={() => this.handleDialogSignUpClick()}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AssignmentIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Créer un compte"/>
                            </ListItem>
                        </List>
                </Dialog>
            </div>
        )
    }
}
