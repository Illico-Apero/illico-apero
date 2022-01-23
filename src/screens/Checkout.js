import React from 'react'
import RedirectionStateHandler from '../helpers/RedirectionStateHandler';
import IllicoSimpleAppBar from '../components/IllicoSimpleAppBar';
import { Badge, Card, CardContent, CardMedia, Dialog, DialogActions, DialogTitle, FormControl, Grid, Button, Typography, ListItemText, List, TableContainer, Paper, TableHead, TableRow, TableCell, Table, TextareaAutosize, CircularProgress, Snackbar, TextField } from '@material-ui/core';
import CartEntity from '../models/CartEntity';
import Utils from '../utils/Utils';
import ApiResponse from '../models/api/ApiResponse';
import CartService from '../network/services/CartService';
import FrontEndLogService from '../network/services/FrontEndLogService';
import IllicoAskForConnection from '../components/IllicoAskForConnection';
import Backdrop from '@material-ui/core/Backdrop';
import { Alert } from '@material-ui/lab';
import IllicoBottomBarAlert from '../components/IllicoBottomBarAlert';
import UserEntity from '../models/UserEntity';
import IllicoAddresses from '../components/IllicoAddresses';
import AddressService from '../network/services/AddressService';
import IllicoAudio from '../utils/IllicoAudio';
import AddressEntity from '../models/AddressEntity';
import yellow_circle from '../assets/design/geometry/yellow_circles_small.png';
import blue_bubble from '../assets/design/geometry/blue_bubble.png';
import OrderService from '../network/services/OrderService';
import Paypal from '../components/Paypal';
import StoreService from '../network/services/StoreService';
import configuration from '../config/configuration.json'
import MuiAlert from '@material-ui/lab/Alert';
import PromotionService from '../network/services/PromotionService';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import IllicoExceptionallyClosed from '../components/IllicoExceptionallyClosed';

const DELIVERY_PRICE = 2.99;

/**
 * DELIVERY PRICE IS DEFINED HERE. If it needs to be changed, it's over here (for display) and over the
 * OrderService.java class (business logic).
 */
export default class Checkout extends IllicoReactComponent {

	static GET_DELIVERY_PRICE() {
		return DELIVERY_PRICE;
	}

	constructor(props) {

		super(props);
		this.state = {
			loaded: false,
			isUserLoggedIn: false,
			/**@type {UserEntity} userEntity */
			userEntity: null,
			quantityInCart: 0,
			/** @type {CartEntity} cartEntity */
			cartEntity: null,
			cartLoadingError: false,
			deliveryPrice: DELIVERY_PRICE,
			userRemark: '',
			paymentSuccessfulAlertOpen: false,
			paymentSuccessfulAlertText: 'Paiement effectué avec succès. Votre commande arrive 🔥🍻💥 !',
			paymentError: false,
			opened: false,
			closedProgrammatically: false,
			loadingPayment: false
		}

		if (configuration.debug) console.warn('app is in debug mode');

		this.handleOrderCreation = this.handleOrderCreation.bind(this);
		this.paymentPlacedCallback = this.paymentPlacedCallback.bind(this);
		this.cartService = new CartService();
		this.frontEndLogService = new FrontEndLogService();
		this.addressService = new AddressService();
		this.orderService = new OrderService();
		this.storeService = new StoreService();
	}
	componentDidMount() { //TODO : CODE REDUNDANCY WITH PROFILE.JS + huge refactor to do.
		// we handle two cases, one with user non initialized in memory and case with user initialized. We then do the exact same thing. Must be refactored
		if (!this.state.isUserLoggedIn || this.state.userEntity === null) {
			this.setState({ userEntity: JSON.parse(localStorage.getItem('userEntity')) }, () => {
				this.setState({ isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn')) }, () => {
					if (this.state.isUserLoggedIn) {
						this.retrieveQuantityInCart(() => { // This order must be kept as it is. When we retrieve quantity in cart, we do proceed to operations on the cart itself.
							this.retrieveCart();
							this.retrieveStoreState();
						});
					} else {
						this.retrieveStoreState();
					}
				});
			});
		}
		else {
			this.retrieveQuantityInCart(() => {
				this.storeService.isStoreOpened((data) => {
					if (data.status !== ApiResponse.GET_ERROR()) {
						if (data.status === ApiResponse.GET_WARNING()) { // TODO closed manually Show that site is disabled (fermeture exceptionnelle)
							console.warn("Store closed programmatically");
						}
						this.setState({ opened: data.response }, () => {
							this.setState({ loaded: true });
						});
					}
					else {
						this.setState({ loaded: true });
					}
				});
			});
		}
	}
	retrieveStoreState() {
		this.storeService.isStoreOpened((data) => {
			if (data.status !== ApiResponse.GET_ERROR()) {
				if (data.status === ApiResponse.GET_WARNING()) { // closed manually
					console.warn("Store closed programmatically");
					this.setState({ closedProgrammatically: true });
					// TODO Show that site is disabled (fermeture exceptionnelle) : DISABLE BUTTON / DO NOT ALLOW TO PAY (paypal visible = false / whole page with warning above)
				}
				this.setState({ opened: data.response }, () => {
					this.setState({ loaded: true });
				});
			}
			else {
				this.setState({ loaded: true });
			}
		});
	}


	retrieveQuantityInCart(callback) { //TODO : code redundancy
		Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
			this.cartService.getAmountIncart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */(data) => {
				if (data.status === ApiResponse.GET_SUCCESS()) { // if API returned amount in cart
					this.setState({ quantityInCart: data.response }, () => {
						if (callback) callback();
					})
				}
				else { // otherwise, keep going
					if (callback) callback();
				}
			})
		});
	}
	retrieveCart() {
		Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
			this.cartService.getCart(this.state.userEntity, this.state.userEntity.jwt, /** @param {ApiResponse} data */(data) => {
				if (data.status === ApiResponse.GET_SUCCESS()) {
					this.setState({ cartEntity: data.response });
				}
				else {
					this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data);
					this.setState({ cartLoadingError: true });
				}
			});
		});
	}
	getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
		return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
	}
	handleTextAreaChange(event) {
		this.setState({ userRemark: event.target.value });
	}
	handleClosePaymentSuccessfulAlert(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ paymentSuccessfulAlertOpen: false });
	}
	handleBackdropLoadingPaymentClose() {
		this.setState({ loadingPayment: false });
	}


	///////////////////////////////// PAYPAL & PAYMENT ///////////////////////////////////////////////////////////////////////////////
	handleOrderCreation(paypalId) {
		this.setState({ loadingPayment: true }, () => {
			Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
				this.orderService.placeOrder(this.state.userEntity, paypalId, this.state.userRemark ? this.state.userRemark : '', this.state.appliedPromotionCode, (data) => {
					console.log("Order placed");
					console.log(data);
					this.setState({ paymentSuccessfulAlertOpen: true });
					Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
						this.cartService.clearCart(this.state.userEntity, this.state.cartEntity, this.state.userEntity.jwt, (data) => {
							this.setState({ loadingPayment: false });
							IllicoAudio.playAddToCartAudio();
							console.log(data);
							setTimeout(() => {
								this.props.history.push("/profile"); // redirection 👌
							}, 1500); // waits for 2000ms
						});
					});
				});
			});
		});
	}
	paymentPlacedCallback(payment) {
		if (payment !== null || payment !== undefined) {
			this.handleOrderCreation(payment.id);
		}
		else {
			this.setState({ paymentError: true });
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	isEverythingOKforCartOperations() {
		return this.state.cartEntity !== null &&
			this.state.cartEntity.totalPrice !== null &&
			(
				// = we atleast have one formula
				(this.state.cartEntity.cartFormulasByIdCart !== null &&
					this.state.cartEntity.cartFormulasByIdCart.length > 0)
				||
				// or product
				(this.state.cartEntity.cartProductsByIdCart !== null &&
					this.state.cartEntity.cartProductsByIdCart.length > 0)
			);
	}
	render() {
		const cardRootStyle = {
			display: 'flex',
			flexFlow: 'row wrap',
			alignContent: 'space-between',
			width: 420,
			marginRight: 'auto',
			marginLeft: 'auto',
			marginBottom: '2em'
		}
		const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDown(this.props.location);
		const loginRedirectState = {
			pathname: '/login',
			state: {
				backUrl: '/checkout',
				slideDirection: 'left',
			}
		}
		const backdrop = {
			zIndex: 999,
			color: '#fff',
		}
		return (
			this.state.loaded ?
			<>
			{
			(this.state.opened || configuration.debug) && !this.state.closedProgrammatically ?
				<>
					<IllicoSimpleAppBar to={previousPageRedirection} title='Livraison et paiement' />
					{
						this.state.isUserLoggedIn ?
							<div>
								{
									this.state.cartLoadingError ?
										<Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
											Une erreur est survenue,
											impossible de charger votre panier.
											Veuillez réessayer plus tard
											ou informer le support.
										</Alert>
										:
										<div id='checkout'>
											{
												this.state.cartEntity !== null && this.state.userEntity !== null ?
													<div id='checkout-loaded'>
													{
														this.state.cartEntity.cartProductsByIdCart.length > 0 || this.state.cartEntity.cartFormulasByIdCart.length > 0 ?

														<div id='checkout-loaded-non-empty'>
															<div id='items-recap'>
																{
																	this.isEverythingOKforCartOperations() ?
																		<Grid container style={{ marginTop: '2em' }}>
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
																									style={{ height: '65px', width:'100px' }}
																								/>
																								<Badge badgeContent={cartFormula.quantity} color="primary" />
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
																									style={{ height: '65px', width:'100px' }}
																								/>
																								<Badge badgeContent={cartProduct.quantity} color="primary" />
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
																<Typography variant='body1' style={{ marginTop: '0.3em', color: '#b26a00', marginBottom: '0.5em' }}>
																	Votre adresse de livraison :
																</Typography>
																{
																	this.state.userEntity !== null &&
																		this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation !== null
																		&& this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress !== null ?
																		<div id='address-display'>
																			<Typography variant='body1' id='identity' style={{ fontSize: '12px' }}>
																				{
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.firstname + ' ' +
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.surname.toUpperCase()
																				}
																			</Typography>
																			<Typography variant='body1' id='postal-address' style={{ fontSize: '12px' }}>
																				{
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.streetNumber + ' ' +
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.street + ', ' +
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.postalCode + ' ' +
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress.city
																				}
																			</Typography>
																			<Typography variant='body1' id='phone' style={{ fontSize: '12px' }}>
																				{
																					this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.phone
																				}
																			</Typography>
																		</div>
																		:
																		''
																}
															</div>
															<div id='fixed-price-recap'>
																{
																	this.isEverythingOKforCartOperations() ?
																		<>
																			<Typography variant='h6' style={{ color: '#b26a00', marginBottom: '0.5em' }}>
																				Récapitulatif
																			</Typography>
																			<>
																				{/*TODO REDUNDANT */}
																				{
																					this.state.cartEntity.cartFormulasByIdCart.length > 0 ?
																						<>
																							<Typography variant='body1' style={{ color: '#b26a00', marginBottom: '1em' }}>
																								Vos Formules {' '}
																								<img src={yellow_circle} alt='yellow geometric circles' style={{ height: '0.8em' }} />
																							</Typography>
																							<TableContainer component={Paper} style={{ width: '300px', margin: 'auto' }}>
																								<Table size='small' style={{ marginRight: '1em' }}>
																									<TableHead>
																										<TableRow>
																											<TableCell>Formule</TableCell>
																											<TableCell align="right">Qté</TableCell>
																											<TableCell align="right">Total</TableCell>
																										</TableRow>
																									</TableHead>
																									<tbody>
																										{
																											this.state.cartEntity.cartFormulasByIdCart.map(
																												(cartFormula, index) => (
																													<TableRow key={index}>
																														<TableCell>
																															{cartFormula.formulaByFkFormula.name}
																														</TableCell>
																														<TableCell align='right'>
																															{cartFormula.quantity}
																														</TableCell>
																														<TableCell align='right'>
																															{(cartFormula.quantity * cartFormula.formulaByFkFormula.price).toFixed(2)}€
																														</TableCell>
																													</TableRow>
																												)
																											)
																										}
																									</tbody>
																								</Table>
																							</TableContainer>
																						</>
																						:
																						''
																				}
																			</>
																			<>
																				{
																					this.state.cartEntity.cartProductsByIdCart.length > 0 ?
																						<>
																							<Typography variant='body1' style={{ color: '#b26a00', marginTop: '2em', marginBottom: '1em' }}>
																								Vos Produits {' '}
																								<img src={blue_bubble} alt='blue geometric circle' style={{ height: '0.7em' }} />
																							</Typography>
																							<TableContainer component={Paper} style={{ width: '300px', margin: 'auto' }}>
																								<Table size='small' style={{ marginRight: '1em' }}>
																									<TableHead>
																										<TableRow>
																											<TableCell>Boisson</TableCell>
																											<TableCell align="right">Qté</TableCell>
																											<TableCell align="right">Total</TableCell>
																										</TableRow>
																									</TableHead>
																									<tbody>
																										{
																											this.state.cartEntity.cartProductsByIdCart.map(
																												(cartProduct, index) => (
																													<TableRow key={index}>
																														<TableCell>
																															{cartProduct.productByFkProduct.name}
																														</TableCell>
																														<TableCell align='right'>
																															{cartProduct.quantity}
																														</TableCell>
																														<TableCell align='right'>
																															{(cartProduct.quantity * cartProduct.productByFkProduct.price).toFixed(2)}€
																														</TableCell>
																													</TableRow>
																												)
																											)
																										}
																									</tbody>
																								</Table>
																							</TableContainer>
																						</>
																						:
																						''
																				}
																			</>
																		</>
																		:
																		''
																}
															</div>
															<div id='delivery-fee'>

																<Typography variant='body1' style={{ marginBottom: '1em', marginTop: '1em', fontSize: '12px' }}>
																	Frais de livraison : {this.state.deliveryPrice.toFixed(2)}€
																</Typography>
															</div>
															<div id='total'>
																{
																	this.state.cartEntity.promotionByFkPromotion !== null && this.state.cartEntity.totalPriceWithPromotion !== null ?
																		<div style={{ marginTop: '1.5em' }}>
																			<Alert severity='success' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
																				Le code promotionnel {this.state.cartEntity.promotionByFkPromotion.promotionCode} de {this.state.cartEntity.promotionByFkPromotion.reductionInPercents}% est appliqué !
																			</Alert>
																			<Alert severity='info' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
																					Total avant promotion (livraison comprise) : {(this.state.cartEntity.totalPrice + this.state.deliveryPrice).toFixed(2) + '€'}.
																					Vous économisez {(this.state.cartEntity.totalPrice - this.state.cartEntity.totalPriceWithPromotion + this.state.deliveryPrice).toFixed(2) + '€ 🤑'}
																			</Alert>
																		</div>
																		:
																		''
																}
																<Typography variant='h6' style={{ color: '#b26a00', marginBottom: '1em', marginTop: '1em' }}>
																	Total à régler&nbsp;:&nbsp;
																	{
																		this.state.cartEntity.promotionByFkPromotion !== null && this.state.cartEntity.totalPriceWithPromotion !== null ?
																			(this.state.cartEntity.totalPriceWithPromotion + this.state.deliveryPrice).toFixed(2) + '€'
																			:
																			(this.state.cartEntity.totalPrice + this.state.deliveryPrice).toFixed(2) + '€'
																	}
																</Typography>
															</div>
															<div id='remark'>
																<Typography variant='h6' style={{ color: '#b26a00', marginBottom: '0.5em', marginTop: '1.5em' }}>
																	Une remarque ?
																</Typography>

																<TextareaAutosize onChange={(event) => this.handleTextAreaChange(event)} style={{ width: '300px', height: '5em' }} placeholder='Si vous souhaitez ajouter une info au livreur... 👀' />
															</div>
															<div id='payment'>
																<Typography variant='h4' style={{ marginTop: '1em', color: '#b26a00', marginBottom: '0.2em' }}>
																	Confirmer et payer
																</Typography>
																<div id='paypal'>
																	<div style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
																		<Paypal userEntity={this.state.userEntity} cartEntity={this.state.cartEntity} paymentPlacedCallback={this.paymentPlacedCallback} />
																	</div>
																</div>
															</div>
															<div id='floating-price-recap' style={{ marginTop: '4em' }}>
																{
																	this.state.cartEntity != null && this.state.cartEntity.totalPrice !== null ?
																		this.state.cartEntity.promotionByFkPromotion !== null & this.state.cartEntity.totalPriceWithPromotion !== null ?
																			<IllicoBottomBarAlert text={'Total avec livraison : ' + (this.state.cartEntity.totalPriceWithPromotion + this.state.deliveryPrice).toFixed(2) + '€'} />
																			:
																			<IllicoBottomBarAlert text={'Total avec livraison : ' + (this.state.cartEntity.totalPrice + this.state.deliveryPrice).toFixed(2) + '€'} />
																		:
																		''
																}
															</div>
														</div>
														:
														<Alert severity='info' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
															Votre panier est vide 😭 !
														</Alert>
													}

													</div>
													:
													<CircularProgress />
											}
										</div>
								}
							</div>
							:
							<IllicoAskForConnection loginRedirectState={loginRedirectState} history={this.props.history} />
					}
					<div id='utils'>
						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.paymentSuccessfulAlertOpen} autoHideDuration={5000} onClose={(event, reason) => this.handleClosePaymentSuccessfulAlert(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleClosePaymentSuccessfulAlert(event, reason)} severity='success'>
								{this.state.paymentSuccessfulAlertText}
							</MuiAlert>
						</Snackbar>
						<Backdrop style={backdrop} open={this.state.loadingPayment} onClick={() => this.handleBackdropLoadingPaymentClose()}>
							<CircularProgress color="inherit" />
						</Backdrop>
						{
							this.state.paymentError ?
								<div id='payment-error'>
									<Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
										Une erreur est survenue pendant le paiement.
										Vous n'avez pas été débité. Veuillez contacter le support
										ou patienter et réessayer plus tard.
									</Alert>
								</div>
								:
								''
						}


					</div>
				</>
				:
				this.state.closedProgrammatically ?
					<IllicoExceptionallyClosed/>
					:
					<Alert severity='error' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '290px', textAlign: 'left' }}>
						Nous sommes actuellement fermés 🥺. Revenez plus tard !
					</Alert>
			}
			</>
			:
			<CircularProgress/>
		)
	}
}