import React from 'react'
import { Alert } from '@material-ui/lab';
import { CircularProgress, Dialog, DialogActions, Button, DialogTitle, Snackbar, Typography, Card, TextField, FormControl } from '@material-ui/core';
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
import StoreService from '../network/services/StoreService';

import configuration from '../config/configuration.json'
import { Link } from 'react-router-dom';
import PromotionService from '../network/services/PromotionService';
import IllicoAddresses from '../components/IllicoAddresses';
import AddressService from '../network/services/AddressService';
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';
import IllicoExceptionallyClosed from '../components/IllicoExceptionallyClosed';


export default class Cart extends IllicoReactComponent {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			quantityInCart: 0,
			bottomNavigationValue: 2,
			isUserLoggedIn: false,
			/** @type {UserEntity} userEntity */
			userEntity: null,
			/** @type {CartEntity} cartEntity*/
			cartEntity: null,
			cartLoadingError: false,
			isQuantityUpdatedAlertOpen: false,
			quantityUpdatedText: 'Panier mis à jour 🍻✅ !',
			isQuantityUpdatedErrorAlertOpen: false,
			quantityUpdateErrorText: 'Impossible de sauvegarder la quantité ❌. Contactez le support.',
			isRemoveItemDialogOpen: false,
			/** @type {RemovalInformations} removalInformations */
			removalInformations: null,
			opened: false,
			closedProgrammatically: false,
			hours: [],
			days: [],
			addressKey: true,
			addressError: false,
			addressHelper: '',
			isAddressDialogOpen: false,
			/** @type {AddressEntity} changedAddress */
			changedAddress: null,
			promotionCodeTextField: '',
			appliedPromotionCode: null,
			radius: {
				distance: 4000
			},
			showNoPromoCodeValidated: false,
			showNoPromoCodeValidatedText: 'Aucun code promo n\'a été entré 😪',
			showPromoCodeInvalid: false,
			showPromoCodeInvalidText: 'Le code promo saisi n\'est pas valide 😕 !',
			showPromoCodeExpired: false,
			showPromoCodeExpiredText: 'Le code promo saisi a expiré 😓',
			showPromoCodeApplied: false,
			showPromoCodeAppliedText: 'Le code promo a été appliqué avec succès 😍 ! ',
			showPromoCodeError: false,
			showPromoCodeErrorText: 'Une erreur est survenue durant l\'ajout du code promo 🥺. Veuillez en faire part à notre équipe !'
		}
		if (configuration.debug) console.warn('app is in debug mode');

		this.handleAddressChange = this.handleAddressChange.bind(this);
		this.cartService = new CartService();
		this.frontEndLogService = new FrontEndLogService();
		this.onQuantityChange = this.onQuantityChange.bind(this);
		this.storeService = new StoreService();
		this.promotionService = new PromotionService();
		this.addressService = new AddressService();
		this.addressService.getDeliveryRadius(
			/** @param {Radius} data */
			(data) => {
				let radius = this.state.radius;
				radius["distance"] = data.radius;
			});
	}

	//TODO : Code redundancy between Profile.js, Cart.js, Category.js, Home.js
	//TODO : idea to test : inherit from a component that will have this method, and bind it to child ? idk
	retrieveQuantityInCart(callback) {
		Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
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
	//TODO : CODE REDUNDANCY WITH PROFILE.JS
	componentDidMount() {
		if (!this.state.isUserLoggedIn || this.state.userEntity === null) {
			this.setState({ userEntity: JSON.parse(localStorage.getItem('userEntity')) }, () => {
				this.setState({ isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn')) }, () => {
					if (this.state.isUserLoggedIn) {
						this.retrieveQuantityInCart(() => { // This order must be kept as it is. When we retrieve quantity in cart, we do proceed to operations on the cart itself.
							this.retrieveCart();
							this.storeService.isStoreOpened((data) => {
								if (data.status !== ApiResponse.GET_ERROR()) {
									if (data.status === ApiResponse.GET_WARNING()) {
										console.warn("Store closed programmatically");
										this.setState({ closedProgrammatically: true });
									}
									this.setState({ opened: data.response }, () => {
										this.storeService.getStore(
											/**
											 * 
											 * @param {StoreEntity} data 
											 */
											(data) => { // TODO : code duplicate with landing.js
												if (data.status === ApiResponse.GET_SUCCESS()) {
													this.state.hours.push(data.response.openHour.slice(0, -3));
													this.state.hours.push(data.response.closeHour.slice(0, -3));
													this.state.days.push(data.response.daysAsList[0]);
													this.state.days.push(data.response.daysAsList[data.response.daysAsList.length - 1]);
													this.setState({ loaded: true });
												}
											})
									});
								}
								else {
									this.setState({ loaded: true });
								}
							});
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
	onQuantityChange(event, item, itemIndex, isItemCartFormula) {
		let newQty;
		if (event) {
			newQty = event.target.value;
		}
		else {
			newQty = 0;
		}
		if (newQty === 0) {
			let currentRemovalInformations = new RemovalInformations(this.state.cartEntity, itemIndex, isItemCartFormula);
			this.setState({ removalInformations: currentRemovalInformations }, () => {
				// this will show the cancel/remove item dialog. If dialog is "accepted",
				// the handleRemoveFromCartAccept() is called, and will use the removalInformations.
				this.setState({ isRemoveItemDialogOpen: true });
			})
		}
		else if (newQty > 0 && newQty < 11) {
			let cart = this.state.cartEntity;
			if (isItemCartFormula) {
				cart.cartFormulasByIdCart[itemIndex].quantity = newQty;
			}
			else {
				cart.cartProductsByIdCart[itemIndex].quantity = newQty;
			}
			this.saveCartAndUpdatePrice(cart)
		}
		else {
			IllicoAudio.playAlertAudio();
			this.setState({ isQuantityUpdatedErrorAlertOpen: true });
			this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), "Tried to update cart with invalid quantity");
		}
	}
	saveCartAndUpdatePrice(cart) {
		Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
			this.cartService.saveCart(this.state.userEntity, cart, this.state.userEntity.jwt, (data) => {
				if (data.status === ApiResponse.GET_SUCCESS()) {
					cart.totalPrice = data.response.totalPrice;
					cart.totalPriceWithPromotion = data.response.totalPriceWithPromotion;
					this.setState({ cartEntity: cart }, () => {
						this.retrieveQuantityInCart(() => { });
					});
					this.setState({ isQuantityUpdatedAlertOpen: true });
				}
				else {
					IllicoAudio.playAlertAudio();
					this.setState({ isQuantityUpdatedErrorAlertOpen: true });
					this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1(), data.response);
				}
			});
		});
	}
	getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
		return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
	}
	handleCloseQuantityUpdatedAlert(event, reason) { //TODO : refactor, redundant
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isQuantityUpdatedAlertOpen: false });
	}
	handleCloseQuantityUpdateErrorAlert(event, reason) { //TODO : refactor, redundant
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isQuantityUpdatedErrorAlertOpen: false });
	}
	handleCloseRemoveItemDialog(even, reason) { //TODO : refactor, redundant
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isRemoveItemDialogOpen: false });
		IllicoAudio.playUiLockAudio();
	}
	handleRemoveFromCartAccept() {
		this.setState({ isRemoveItemDialogOpen: false });
		let cart = this.state.cartEntity;
		let removalInformations = this.state.removalInformations;
		if (removalInformations.isItemCartFormula) {
			delete this.state.cartEntity.cartFormulasByIdCart[removalInformations.itemIndex];
		}
		else {
			delete this.state.cartEntity.cartProductsByIdCart[removalInformations.itemIndex];
		}
		this.saveCartAndUpdatePrice(cart)
		IllicoAudio.playUiLockAudio();
	}
	handleRemoveFromCartCancel() {
		this.setState({ isRemoveItemDialogOpen: false });
		IllicoAudio.playUiLockAudio();
	}
	handleAddressChange(event, value) {
		if (value != null) {
			let approxDistanceFromCenter = value.approxMetersFromMainStorageCenter;
			if (approxDistanceFromCenter > this.state.radius.distance) {
				// Address is changed but invalid. No dialog is shown and error message appears.
				IllicoAudio.playAlertAudio();
				this.setState({ addressError: true });
				this.setState({ addressHelper: 'Cette addresse n\'est pas éligible !' });
				this.setState({ addressKey: !this.state.addressKey }) // just negates the key so that address is reset.
			}
			else if (approxDistanceFromCenter < this.state.radius.distance) {
				// Address is changed and is valid. Asks for user confirmation by showing up a dialog.
				this.setState({ addressError: false });
				this.setState({ addressHelper: '' });
				this.setState({ changedAddress: value }, () => {
					this.setState({ isAddressDialogOpen: true });
				})
			}
		}
	}
	handleAddressChangeAccept() {
		if (this.state.changedAddress) {
			Utils.handleEventuallyExpiredJwt(this.state.userEntity, () => {
				this.setState({ isAddressDialogOpen: false });
				IllicoAudio.playUiLockAudio();
				this.addressService.changeAddress(this.state.userEntity, this.state.changedAddress, /** @param {ApiResponse} response */(response) => {
					if (response.status === ApiResponse.GET_SUCCESS()) {
						let userEntityCopy = this.state.userEntity;
						userEntityCopy.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress = this.state.changedAddress;
						this.setState({ userEntity: userEntityCopy });
						localStorage.setItem('userEntity', JSON.stringify(userEntityCopy));
					}
					else {
						this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1, "Error occured while trying to change address. Check server logs : " + response.response);
					}
				});
			});
		}
		else {
			this.frontEndLogService.saveLog(this.getUserIdIfLoggedInOtherwiseMinus1, "The state.changedAddress object was null when trying to change address during checkout.");
		}
	}
	handleAddressChangeCancel() {
		this.setState({ isAddressDialogOpen: false });
		this.setState({ addressKey: !this.state.addressKey }) // just negates the key so that address is reset.
		IllicoAudio.playUiLockAudio();
	}
	handlePromotionChange(value) {
		this.setState({ promotionCodeTextField: value })
	}
	handleCloseShowNoPromo(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showNoPromoCodeValidated: false });
	}
	handleCloseShowPromoCodeExpired(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showPromoCodeExpired: false });
	}
	handleCloseShowPromoCodeInvalid(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showPromoCodeInvalid: false });
	}
	handleCloseShowPromoCodeApplied(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showPromoCodeApplied: false });
	}
	handleCloseShowPromoCodeError(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ showPromoCodeError: false });
	}
	applyPromotionCode() {
		if (this.state.promotionCodeTextField !== '') {
			Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
				this.promotionService.getIfValid(this.state.promotionCodeTextField, this.state.userEntity.jwt, (data) => {
					if (data.status === ApiResponse.GET_ERROR()) {
						this.frontEndLogService.saveLog(this.state.userEntity !== null ? this.state.userEntity.idUser : 0, 'Saisie de code promo invalide : ' + this.state.promotionCodeTextField);
						IllicoAudio.playAlertAudio();
						this.setState({ showPromoCodeInvalid: true });
					}
					else if (data.status === ApiResponse.GET_SUCCESS()) {
						this.cartService.applyPromotion(this.state.userEntity, data.response, (cartResponse) => {
							if (cartResponse.status === ApiResponse.GET_SUCCESS()) {
								IllicoAudio.playRegisterOrLogInAudio();
								this.setState({ showPromoCodeApplied: true });
								this.setState({ cartEntity: cartResponse.response });
							}
							else if (cartResponse.status === ApiResponse.GET_WARNING()) {
								IllicoAudio.playAlertAudio();
								this.setState({ showPromoCodeExpired: true });
							}
							else {
								IllicoAudio.playAlertAudio();
								this.setState({ showPromoCodeError: true });
								this.frontEndLogService.saveLog(this.state.userEntity.idUser, 'Could not apply promo code : ' + JSON.stringify(cartResponse));
							}
						})
						//TODO : Popup, apply promotion code on order (visual) + init this.state.appliedPromotionCode (that will apply promotion on server side when placing order).

					}
				});
			});
		}
		else {
			IllicoAudio.playAlertAudio();
			this.setState({ showNoPromoCodeValidated: true });
		}
	}

	render() {
		const loginRedirectState = {
			pathname: '/login',
			state: {
				backUrl: '/cart',
				slideDirection: 'left',
			}
		}
		const checkoutRedirectState = {
			pathname: '/checkout',
			state: {
				backUrl: '/cart',
				slideDirection: 'left'
			}
		}
		const checkoutRootStyle = {
			display: 'flex',
			width: 190,
			marginRight: 'auto',
			marginLeft: 'auto',
			marginBottom: '2em',
			padding: '1em',
			textAlign: 'left'
		}
		let buttonDisabled = true;
		if (this.state.opened) buttonDisabled = false;
		if (configuration.debug) buttonDisabled = false;
		return (
			this.state.loaded ?
				<>
					<IllicoTopNavigation title='Panier' backUrl='/Cart' isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
					{
						this.state.isUserLoggedIn ?
							<div id='cart'> {
								this.state.cartLoadingError ?
									<Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
										Une erreur est survenue,
										impossible de charger votre panier.
										Veuillez réessayer plus tard
										ou informer le support.
									</Alert>
									:
									''
							}{
									this.state.cartEntity !== null ?
										<div style={{ marginBottom: '15em' }}> {
											(this.state.cartEntity.cartFormulasByIdCart.length === 0 && this.state.cartEntity.cartProductsByIdCart.length === 0) ||
												(this.state.cartEntity.cartFormulasByIdCart.every(item => !item) && this.state.cartEntity.cartProductsByIdCart.every(item => !item)) ?
												<Alert severity='info' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
													Votre panier est vide 😭 !
												</Alert>
												:
												<div id="cart">
													{
														(this.state.opened || configuration.debug) && !this.state.closedProgrammatically ?
															<div id="infos" style={{ marginTop: '2em', marginBottom: '1em' }}>

																<div id='address'>
																	<div id='address-display'>
																		{
																			this.state.userEntity !== null &&
																				this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation !== null
																				&& this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.addressByFkAddress !== null ?
																				<div id='address-display'>
																					<Typography variant='body1' id='identity' style={{ fontSize: '14px' }}>
																						Votre adresse de livraison :
																					</Typography>
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
																	<div id='address-change'>
																		<Typography variant='body1' style={{ marginTop: '0.3em', color: '#b26a00', marginBottom: '0.5em' }}>
																			Changer d'adresse :
																		</Typography>
																		<FormControl style={{ width: '300px', marginBottom: '2em' }}>
																			<IllicoAddresses key={this.state.addressKey} addressHelper={this.state.addressHelper} addressError={this.state.addressError} onChange={this.handleAddressChange} />
																		</FormControl>
																	</div>
																</div>
																<div id='promotion'>
																	<Typography variant='body1' style={{ marginTop: '0.3em', color: '#b26a00', marginBottom: '0.5em' }}>
																		Code promotionnel
																	</Typography>
																	<TextField style={{backgroundColor:'white'}} id="promotion-code" label="Saisir votre code promo" variant="outlined" color="secondary" value={this.state.promotionCodeTextField}
																		onChange={(event) => this.handlePromotionChange(event.target.value)} />

																	<div id='confirm-promotion' style={{ marginTop: '1em' }}>
																		<Button onClick={() => this.applyPromotionCode()} variant='contained' color='primary' style={{ fontWeight: 'bold', marginBottom: '1em' }}>
																			Appliquer mon code !
																		</Button>
																	</div>
																	{
																		this.state.cartEntity.promotionByFkPromotion !== null && this.state.cartEntity.totalPriceWithPromotion !== null ?
																			<div style={{ marginTop: '1.5em' }}>
																				<Alert severity='success' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
																					Le code promotionnel {this.state.cartEntity.promotionByFkPromotion.promotionCode} de {this.state.cartEntity.promotionByFkPromotion.reductionInPercents}% est appliqué !
																				</Alert>
																			</div>
																			:
																			''
																	}
																</div>
																<div>
																{
																	this.state.cartEntity.promotionByFkPromotion !== null && this.state.cartEntity.totalPriceWithPromotion !== null ?
																	<div style={{ marginTop: '1.5em' }}>
																				<Alert severity='info' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
																					Prix avant promotion : {this.state.cartEntity.totalPrice.toFixed(2) + '€'}. 
																					Vous économisez {(this.state.cartEntity.totalPrice - this.state.cartEntity.totalPriceWithPromotion).toFixed(2) + '€ 🤑'}
																				</Alert>
																			</div>
																			:
																			''
																}
																</div>

																<Typography variant='body1' style={{ marginTop: '0.3em', color: '#b26a00', marginBottom: '0.5em' }}>
																	Paiement
																</Typography>
																<Card elevation={3} style={checkoutRootStyle}>
																	<div style={{ paddingRight: '0.5em', marginTop: '10px' }}>
																		<Typography>
																			Total
																		</Typography>
																		<Typography variant='body1' gutterBottom style={{ paddingTop: '0.1em', color: '#b26a00', fontSize: '0.8em', marginBottom: '0.3em' }}>
																			{
																				this.state.cartEntity !== null && this.state.cartEntity.promotionByFkPromotion !== null && this.state.cartEntity.totalPriceWithPromotion !== null ?
																					this.state.cartEntity.totalPriceWithPromotion.toFixed(2) + '€'
																					:
																					this.state.cartEntity.totalPrice.toFixed(2) + '€'
																			}
																		</Typography>
																	</div>
																	<div style={{ marginLeft: '1em' }}>

																		<Button disabled={buttonDisabled} component={Link} to={checkoutRedirectState} onClick={() => IllicoAudio.playTapAudio()} variant='contained' color='primary' style={{ fontWeight: 'bold' }}>
																			Passer au paiement
																		</Button>
																	</div>
																</Card>
															</div>
															:
															this.state.closedProgrammatically ?
																<IllicoExceptionallyClosed/>
																:
																<Alert severity='error' elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '290px', textAlign: 'left' }}>
																	Nous sommes actuellement fermés 🥺. Revenez plus tard !
																	Nous sommes ouvert entre entre <b>{this.state.hours[0]} et {this.state.hours[1]}</b> du <b>{this.state.days[0]} au {this.state.days[1]}</b>
																</Alert>
													}
													<div id='formulas'> {
														this.state.cartEntity.cartFormulasByIdCart !== null &&
															this.state.cartEntity.cartFormulasByIdCart.length > 0 &&
															!this.state.cartEntity.cartFormulasByIdCart.every(item => !item) ?
															<>
																<Typography variant='h5' style={{ marginTop: '1em', marginBottom: '0.5em', color: '#b26a00' }}>
																	Vos Formules {' '}
																	<img src={yellow_circle} alt='yellow geometric circles' style={{ height: '0.7em' }} />
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
																<Typography variant='h5' style={{ marginTop: '2em', marginBottom: '0.5em', color: '#b26a00' }}>
																	Vos Produits {' '}
																	<img src={blue_bubble} alt='blue geometric circle' style={{ height: '0.7em' }} />
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
										<div style={{ marginBottom: '6em', marginTop: '1em' }}>
											<CircularProgress />
										</div>
								}
							</div>
							:
							<IllicoAskForConnection loginRedirectState={loginRedirectState} history={this.props.history} />
					}
					<IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart} />
					<div id='dialogs'>
						<Dialog onClose={(event, reason) => this.handleCloseRemoveItemDialog(event, reason)} aria-labelledby="address-change-title" open={this.state.isAddressDialogOpen}>
							<DialogTitle id="address-change-title">Confirmer le changement d'adresse ?</DialogTitle>
							<DialogActions>
								<Button variant='contained' color='secondary' onClick={() => this.handleAddressChangeCancel()}> Annuler </Button>
								<Button variant='contained' color='primary' onClick={() => this.handleAddressChangeAccept()} autoFocus> Confirmer </Button>
							</DialogActions>
						</Dialog>
						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.isQuantityUpdatedAlertOpen} autoHideDuration={1500} onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseQuantityUpdatedAlert(event, reason)} severity="success">
								{this.state.quantityUpdatedText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.isQuantityUpdatedErrorAlertOpen} autoHideDuration={5000} onClose={(event, reason) => this.handleCloseQuantityUpdateErrorAlert(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseQuantityUpdateErrorAlert(event, reason)} severity="error">
								{this.state.quantityUpdateErrorText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showNoPromoCodeValidated} autoHideDuration={2000} onClose={(event, reason) => this.handleCloseShowNoPromo(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseShowNoPromo(event, reason)} severity='error'>
								{this.state.showNoPromoCodeValidatedText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showPromoCodeInvalid} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseShowPromoCodeInvalid(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseShowPromoCodeInvalid(event, reason)} severity='error'>
								{this.state.showPromoCodeInvalidText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showPromoCodeExpired} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseShowPromoCodeExpired(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseShowPromoCodeExpired(event, reason)} severity='warning'>
								{this.state.showPromoCodeExpiredText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showPromoCodeApplied} autoHideDuration={3000} onClose={(event, reason) => this.handleCloseShowPromoCodeApplied(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseShowPromoCodeApplied(event, reason)} severity='success'>
								{this.state.showPromoCodeAppliedText}
							</MuiAlert>
						</Snackbar>

						<Snackbar style={{ marginBottom: '3.5em' }} open={this.state.showPromoCodeError} autoHideDuration={10000} onClose={(event, reason) => this.handleCloseShowPromoCodeError(event, reason)}>
							<MuiAlert onClose={(event, reason) => this.handleCloseShowPromoCodeError(event, reason)} severity='error'>
								{this.state.showPromoCodeErrorText}
							</MuiAlert>
						</Snackbar>

						<Dialog onClose={(event, reason) => this.handleCloseRemoveItemDialog(event, reason)} aria-labelledby="delete-cart-item-title" open={this.state.isRemoveItemDialogOpen}>
							<DialogTitle id="delete-cart-item-title">Supprimer l'article du panier ?</DialogTitle>
							<DialogActions>
								<Button variant='contained' color='secondary' onClick={() => this.handleRemoveFromCartCancel()}> Annuler </Button>
								<Button variant='contained' color='primary' onClick={() => this.handleRemoveFromCartAccept()} autoFocus> Supprimer </Button>
							</DialogActions>
						</Dialog>
					</div>
				</>
				:
				<CircularProgress />
		)
	}
}
