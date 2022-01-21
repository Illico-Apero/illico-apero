import React from 'react'
import Fade from '@material-ui/core/Fade';
import MuiAlert from '@material-ui/lab/Alert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {
	Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText,
	CircularProgress, Grid, Snackbar, Typography
} from '@material-ui/core';

import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";

import ProductService from '../network/services/ProductService';
import ProductEntity from '../models/ProductEntity';
import UserEntity from '../models/UserEntity';
import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse'
import RedirectionStateHandler from '../helpers/RedirectionStateHandler'
import IllicoProduct from '../components/IllicoProduct';
import IllicoBottomNavigation from '../components/IllicoBottomNavigation';
import IllicoAudio from '../utils/IllicoAudio';
import CartService from '../network/services/CartService';
import { Link } from 'react-router-dom';
import FrontEndLogService from '../network/services/FrontEndLogService';
import { Alert } from '@material-ui/lab';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import IllicoBottomBarAlert from '../components/IllicoBottomBarAlert';

//TODO : Stock handling (Formula (home.js) & products (category.js))
/**
 * @param {String} category : the products category page
 */
export default class Category extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			bottomNavigationValue: 1,
			category: this.props.location.state !== undefined && this.props.location.state.category !== null ? this.props.location.state.category : 'Spiritueux',
			isUserLoggedIn: this.props.location.state !== undefined ? this.props.location.state.isUserLoggedIn : false,
			/** @type {UserEntity} */
			userEntity: this.props.location.state !== undefined && this.props.location.state.userEntity !== null ? this.props.location.state.userEntity : null,
			/** @type {Array<ProductEntity>} products*/
			products: null,
			quantityInCart: 0,
			addedToCartAlert: false,
			addedToCartMessage: "C'est ajouté au panier 🍻 !",
			isNotLoggedInDialogOpen: false,
			isAddMoreThan9itemsWarningAlertOpen: false,
			addMoreThan9itemsWarningAlert: "Impossible de dépasser la quantité autorisée (9 max)",
			isAddToCartErrorAlertOpen: false,
			addToCartErrorAlertText: "Impossible d'ajouter au panier ❌. Contactez le support.",
			categoryLoadingError: false
		}

		this.productService = new ProductService();
		this.frontEndLogService = new FrontEndLogService();
		this.cartService = new CartService();
		this.initializeProducts();
	}

	initializeProducts() {
		this.productService.getProductsFromCategory(this.state.category, (data) => {
			if (data.status === ApiResponse.GET_SUCCESS()) {
				this.setState({ products: data.response })
			}
			else {
				this.setState({ categoryLoadingError: true })
				console.error(data.response);
				let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
				this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
			}
		})
	}
	retrieveQuantityInCart(callback) {
		Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
			this.cartService.getAmountIncart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */(data) => {
				if (data.status === ApiResponse.GET_SUCCESS()) { // if API returned amount in cart
					this.setState({ quantityInCart: data.response }, () => {
						callback();
					})
				}
				else { // otherwise, keep going
					callback();
				}
			})
		});
	}
	handleCloseAddedToCartAlert(event, reason) { //TODO : redundant, pass bool to change as param
		if (reason === 'clickaway') {

			return;
		}
		this.setState({ addedToCartAlert: false });
	}
	handleCloseAddMoreThan9itemsWarningAlert(event, reason) { //TODO : redundant, pass bool to change as param
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isAddMoreThan9itemsWarningAlertOpen: false });
	}
	handleCloseAddToCartErrorAlert(event, reason) { //TODO : redundant, pass bool to change as param
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isAddToCartErrorAlertOpen: false });
	}
	handleCloseNotLoggedInDialog() {  //TODO : redundant, pass bool to change as param
		this.setState({ isNotLoggedInDialogOpen: false });
		IllicoAudio.playUiLockAudio();
	}
	handleDialogSignInClick() {
		IllicoAudio.playTapAudio(); //TODO : is it working ? test when not connected
	}
	handleDialogSignUpClick() {
		IllicoAudio.playTapAudio(); //TODO : is it working ? test when not connected
	}
	getUserIdIfLoggedInOtherwiseMinus1() {
		return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
	}
	componentDidMount() {
		if (!this.state.isUserLoggedIn || this.state.userEntity === null) {
			this.setState({ userEntity: JSON.parse(localStorage.getItem('userEntity')) }, () => {
				this.setState({ isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn')) }, () => {
					if (this.state.isUserLoggedIn) {
						this.retrieveQuantityInCart(() => {
							this.setState({ loaded: true });
						});
					} else {
						this.setState({ loaded: true });
					}
				});
			});
		}
		else {
			this.retrieveQuantityInCart(() => {
				this.setState({ loaded: true });
			});
		}
	}

	// TODO : BOTH FOR HOME AND CATEGORY/JS : REFACTOR / INHERIT FROM GENERIC COMPONENT and pass param 
	addProductToCart(product) {
		if (this.state.isUserLoggedIn) {
			Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
				if (refreshedUserEntity !== null) {
					this.setState({ userEntity: refreshedUserEntity });
					this.cartService.addProductToCart(product, refreshedUserEntity.jwt, (data) => {
						if (data.status === ApiResponse.GET_SUCCESS()) {
							this.handleUiRefreshAfterProductSuccessfullyAddedToCart();
						}
						else if (data.status === ApiResponse.GET_WARNING()) {
							this.setState({ isAddMoreThan9itemsWarningAlertOpen: true });
						}
						else {
							this.setState({ isAddToCartErrorAlertOpen: true });
							this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data.response);
						}
					});
				}
				else {
					this.setState({ isAddToCartErrorAlertOpen: true });
					this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), this.state.userEntity);
				}
			});
		}
		else {
			this.setState({ isNotLoggedInDialogOpen: true });
			IllicoAudio.playAlertAudio();
		}
	}

	handleUiRefreshAfterProductSuccessfullyAddedToCart() {
		this.setState({ quantityInCart: this.state.quantityInCart + 1 }); // no need to call the server for this, it's just local information anyways, that will be retrieved onLoad.
		this.setState({ addedToCartAlert: true }, () => {
			IllicoAudio.playAddToCartAudio();
		});
	}

	render() {
		// according to the previous page passed within the props, we use it as a return page for the AppBar. By default, we use '/' (home)
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDownWithGivenPreviousPage('/home');
		const loginRedirectState = {
			pathname: '/login',
			state: {
				backUrl: '/category',
				slideDirection: 'left',
				category: this.state.category
			}
		}
		const registerRedirectState = {
			pathname: '/register',
			state: {
				backUrl: '/category',
				slideDirection: 'left',
				category: this.state.category
			}
		}
		if (this.state.categoryLoadingError) {
			return (
				<div>
					<Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
						Une erreur est survenue,
						impossible de contacter le serveur pour charger la page.
						Veuillez réessayer plus tard
						ou informer le support.
					</Alert>
				</div>
			)
		}
		return (
			<div>
				<Fade in={this.state.loaded} mountOnEnter unmountOnExit timeout={400}>
					<div>
						<IllicoSimpleAppBar to={previousPageRedirection} title={Utils.getCategoryPluralWith_LES_inFrontAndEmoji(this.state.category)} />
						{
							this.state.products !== null ?
							<>
								<div id='products' style={{ marginBottom: '5em' }}>
									<Grid container>
										{
											this.state.products.map(
												(product, index) => (
													<Grid key={index} item xs>
														<IllicoProduct product={product} onBasketAddClick={() => this.addProductToCart(product)} />
													</Grid>
												))
										}
									</Grid>
								</div>
							</>
								:
								<CircularProgress />
						}
					</div>
				</Fade>
				<IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart} />
				<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.addedToCartAlert} autoHideDuration={1500} onClose={(event, reason) => this.handleCloseAddedToCartAlert(event, reason)}>
					<MuiAlert onClose={(event, reason) => this.handleCloseAddedToCartAlert(event, reason)} severity="success">
						{this.state.addedToCartMessage}
					</MuiAlert>
				</Snackbar>
				<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.isAddToCartErrorAlertOpen} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseAddToCartErrorAlert(event, reason)}>
					<MuiAlert onClose={(event, reason) => this.handleCloseAddToCartErrorAlert(event, reason)} severity="error">
						{this.state.addToCartErrorAlertText}
					</MuiAlert>
				</Snackbar>
				<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.isAddMoreThan9itemsWarningAlertOpen} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseAddMoreThan9itemsWarningAlert(event, reason)}>
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
									<AccountCircleIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Se connecter" />
						</ListItem>

						<ListItem button component={Link} to={registerRedirectState} onClick={() => this.handleDialogSignUpClick()}>
							<ListItemAvatar>
								<Avatar>
									<AssignmentIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Créer un compte" />
						</ListItem>
					</List>
				</Dialog>
			</div>
		)
	}
}
