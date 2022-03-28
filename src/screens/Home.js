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
import IllicoReactComponent from '../components/Generic/IllicoReactComponent';

export default class Home extends IllicoReactComponent {

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
      generalMenuAnchor: null,
      profileMenuAnchor: null,
      quantityInCart: 0,
      homeLoadingError: false
    }
    this.productService = new ProductService();
    this.cartService = new CartService();
    this.userService = new UserService();
    this.frontEndLogService = new FrontEndLogService();

    this.initializeCategories();
  }

  initializeCategories() {
    this.productService.getCategories(
      /** @param {ApiResponse} data */
      (data) => {
        if (data.status === ApiResponse.GET_SUCCESS()) {
          this.setState({ categories: data.response }, () => {
            this.setState({ loaded: true});
          })
        }
        else if (data.status === ApiResponse.GET_ERROR()) {
          this.setState({ homeLoadingError: true });
          console.error(data.response);
          let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
          this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
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



  getUserIdIfLoggedInOtherwiseMinus1() { //TODO : refactor, redundant
    return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
  }
  componentDidMount() {
    this.setState({ userEntity: JSON.parse(localStorage.getItem('userEntity')) }, () => {
      this.setState({ isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn')) }, () => {
        if (this.state.isUserLoggedIn) {
          this.retrieveQuantityInCart(() => {
            this.initializeCategories();
          });
        } else {
          this.initializeCategories();
        }
      });
    });
  }

  getCategoryRedirectState(category) {
    return {
      pathname: '/category',
      state: {
        backUrl: '/home',
        category: category,
        isUserLoggedIn: this.state.isUserLoggedIn,
        userEntity: this.state.userEntity
      }
    }
  }

  /** //TODO : Indiquer que le site utilise des cookies via une popup par dessus en bas à droite (cf screen bureau) + enregistrer le choix (localstorage ?)
   * Cookies - indiquer que ceux d'illico sont nécessaires au bon fonctionnement du site et ne sont divulgués à quiconque
   */

  render() {
    const registerRedirectState = {
      pathname: '/register',
      state: {
        backUrl: '/home',
        slideDirection: 'left'
      }
    }
    const formulaRedirectState = {
      pathname: '/formula',
      state: {
        backUrl: '/home',
        slideDirection: 'left'
      }
    };

    if (!this.state.loaded && !this.state.categories) {
      return (
        <div>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div>
        {
          this.state.loaded ?
            this.state.homeLoadingError ?
              <div>
                <Alert severity="error" elevation={3} style={{ marginTop: '2em', marginBottom: '2em', marginLeft: 'auto', marginRight: 'auto', width: '260px', textAlign: 'left' }}>
                  Une erreur est survenue,
                  impossible de contacter le serveur pour charger la page.
                  Veuillez réessayer plus tard
                  ou informer le support.
                </Alert>
              </div>
              :
              <div>
                <IllicoTopNavigation showLogo backUrl={"/home"} isUserLoggedIn={this.state.isUserLoggedIn} userEntity={this.state.userEntity} />
                <Slide direction='up' in={this.state.loaded} mountOnEnter unmountOnExit timeout={400}>
                  <div>
                    <div id='formulas'>
                      <Typography variant='h4' gutterBottom style={{ paddingTop: '0.1em', color: '#b26a00', marginBottom: '1em', marginTop:'1em', fontWeight:'bold' }}>
                        NOS FORMULES {' '}
                        <img src={blue_bubble} alt='blue geometric circle' style={{
                          height: '0.7em'
                        }} />
                      </Typography>
                      <IllicoChip text='Les formules 🥂' color='primary' to={formulaRedirectState} />
                      <IllicoCategory image='Formules' to={formulaRedirectState} />

                    </div>
                    { /************************** CATEGORIES **************************/}
                    <div id="categories">
                      <Typography variant='h4' gutterBottom style={{ paddingTop: '0.3em', color: '#b26a00', marginBottom: '1em', marginTop: '1em', fontWeight:'bold'  }}>
                        NOS CATÉGORIES {' '}
                        <img src={yellow_circle} alt='yellow geometric circles' style={{
                          height: '0.7em'
                        }} />
                      </Typography>
                      {
                        this.state.categories !== null ?
                          <Grid container spacing={2} xs={12}>
                            {
                              this.state.categories.map((category, index) => (
                                <Grid key={index} item xs>
                                  <Typography variant='subtitle1' gutterBottom style={{ paddingTop: '0.1em', color: '#b26a00' }}>
                                    <div onClick={() => IllicoAudio.playNavigationForwardAudio()}>
                                      <IllicoChip text={Utils.getCategoryPluralWith_LES_inFrontAndEmoji(category)} color='primary' to={this.getCategoryRedirectState(category)} />
                                    </div>
                                  </Typography>
                                  <div onClick={() => IllicoAudio.playNavigationForwardAudio()}>
                                    <IllicoCategory image={category} to={this.getCategoryRedirectState(category)} />
                                  </div>
                                </Grid>
                              ))
                            }
                          </Grid>
                          :
                          <CircularProgress/>
                      }
                    </div>
                    <div style={{ marginTop: '4em' }} />
                    <div style={{ marginBottom: '4em' }} />
                  </div>
                </Slide>

                <div>
                  {
                    !this.state.loaded ?
                      <div style={{ marginBottom: '5em' }}>
                        <CircularProgress />
                      </div>
                      : ''
                  }
                </div>
                <IllicoBottomNavigation bottomNavigationValue={this.state.bottomNavigationValue} quantityInCart={this.state.quantityInCart} />
              </div>
            :
            <CircularProgress/>
        }
      </div>
    )
  }
}
