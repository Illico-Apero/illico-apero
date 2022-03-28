import React from 'react'
import IllicoReactComponent from "../components/Generic/IllicoReactComponent";
import ApiResponse from "../models/api/ApiResponse";
import FormulaService from '../network/services/FormulaService';
import IllicoAudio from "../utils/IllicoAudio";
import Utils from "../utils/Utils";
import Typography from "@material-ui/core/Typography";
import blue_bubble from "../assets/design/geometry/blue_bubble.png";
import Grid from "@material-ui/core/Grid";
import IllicoFormula from "../components/IllicoFormula";
import CircularProgress from "@material-ui/core/CircularProgress";
import RedirectionStateHandler from "../helpers/RedirectionStateHandler";
import {Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {Link} from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AssignmentIcon from "@material-ui/icons/Assignment";
import FrontEndLogService from "../network/services/FrontEndLogService";
import {Alert} from "@material-ui/lab";
import IllicoSimpleAppBar from "../components/IllicoSimpleAppBar";
import Fade from '@material-ui/core/Fade';
import IllicoBottomNavigation from "../components/IllicoBottomNavigation";
import CartService from "../network/services/CartService";


export default class Formula extends IllicoReactComponent {


  constructor(props) {
    super(props);
    this.state = {
      /**@type Array<FormulaEntity> */
      formulas: null,
      quantityInCart: 0,
      addedToCartAlert: false,
      addedToCartMessage: "Formule ajoutée au panier 🍻 !",
      isNotLoggedInDialogOpen: false,
      isAddToCartErrorAlertOpen: false,
      addToCartErrorAlertText: "Impossible d'ajouter au panier ❌. Contactez le support.",
      isAddMoreThan9itemsWarningAlertOpen: false,
      addMoreThan9itemsWarningAlert: "Impossible de dépasser la quantité autorisée (9 max)",
      formulaLoadingError:false,
      loaded:false
    }
    this.formulaService = new FormulaService();
    this.frontEndLogService = new FrontEndLogService();
    this.cartService = new CartService();

    this.initializeFormulas();
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


  getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
    return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
  }

  initializeFormulas() {
    this.formulaService.getFormulas(
      /** @param {ApiResponse} data */
      (data) => {
        if (data.status === ApiResponse.GET_SUCCESS()) {
          this.setState({ formulas: data.response }, () =>
            this.setState({ loaded:true })
          );
        }
        else if (data.status === ApiResponse.GET_ERROR()) {
          this.setState({ formulaLoadingError: true }, () =>
            this.setState({ loaded:true })
          );
          console.error(data.response);
          let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
          this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
        }
      });
  }

  handleCloseAddedToCartAlert(event, reason) {
    if (reason === 'clickaway') {

      return;
    }
    this.setState({ addedToCartAlert: false });
  }
  handleCloseAddToCartErrorAlert(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ isAddToCartErrorAlertOpen: false });
  }

  handleCloseAddMoreThan9itemsWarningAlert(event, reason) { //TODO : redundant, pass bool to change as param
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ isAddMoreThan9itemsWarningAlertOpen: false });
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

  addFormulaToCart(formula) {
    if(!formula.available) {
      return;
    }
    if (this.state.isUserLoggedIn) {
      Utils.handleEventuallyExpiredJwt(this.state.userEntity, (refreshedUserEntity) => {
        if (refreshedUserEntity !== null) {
          this.setState({ userEntity: refreshedUserEntity });
          this.cartService.addFormulaToCart(formula, refreshedUserEntity.jwt, (data) => {
            if (data.status === ApiResponse.GET_SUCCESS()) {
              this.handleUiRefreshAfterFormulaSuccessfullyAddedToCart();
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

  handleUiRefreshAfterFormulaSuccessfullyAddedToCart() {
    this.setState({ quantityInCart: this.state.quantityInCart + 1 }); // no need to call the server for this, it's just local information anyways, that will be retrieved onLoad.
    this.setState({ addedToCartAlert: true }, () => {
      IllicoAudio.playAddToCartAudio();
    });
  }

  render() {
    const previousPageRedirection = RedirectionStateHandler.getRedirectionStateWithSlideDownWithGivenPreviousPage('/home');
    const loginRedirectState = {
      pathname: '/login',
      state: {
        backUrl: '/formula',
        slideDirection: 'left',
      }
    };
    const registerRedirectState = {
      pathname: '/register',
      state: {
        backUrl: '/formula',
        slideDirection: 'left',
      }
    };

    if (this.state.formulaLoadingError) {
      return (
        <div>
          <Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
            Une erreur est survenue, impossible de contacter le serveur pour charger la page.
            Veuillez réessayer plus tard ou informer le support.
          </Alert>
        </div>
      );
    }

    return(
      <Fade in={this.state.loaded} mountOnEnter unmountOnExit timeout={400}>
      <div id="formulas">
        <IllicoSimpleAppBar to={previousPageRedirection} title='Les formules 🥂' />
        {
          this.state.formulas !== null ?
            <div style={{ marginBottom: '6em' }}>
              {
                <Grid container spacing={3} xs={12}>
                  {
                    this.state.formulas.map(
                      /**
                       *
                       * @param {FormulaEntity} item
                       * @param {Number} index
                       */
                      (formula, index) => (
                        <Grid key={index} item xs>
                          <IllicoFormula image={formula.picturePath} title={formula.name} description={formula.description} price={formula.price} available={formula.available}
                                         onBasketAddClick={() => this.addFormulaToCart(formula)} />
                        </Grid>
                      ))
                  }
                </Grid>

              }
            </div>
            : <div style={{ marginBottom: '6em' }}>
              <CircularProgress />
            </div>
        }
        <IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart} />
        <div id='utils'>
          {/* Snackbars and alerts */}
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
      </div>
      </Fade>
    );
  }
}