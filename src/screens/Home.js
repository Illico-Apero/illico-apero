import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';


import Person from '@material-ui/icons/Person';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import HomeIcon from '../components/Generic/HomeIcon';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import UserEntity from '../models/UserEntity';
import FormulaEntity from '../models/FormulaEntity';
import FormulaService from '../network/services/FormulaService';
import ProductService from '../network/services/ProductService';
import ApiResponse from '../models/api/ApiResponse';
import FrontEndLogService from '../network/services/FrontEndLogService';

import IllicoCategory from '../components/IllicoCategory';
import IllicoFormula from '../components/IllicoFormula';
import IllicoChip from '../components/IllicoChip';

import yellow_circle from '../assets/design/geometry/yellow_circles_small.png';
import blue_bubble from '../assets/design/geometry/blue_bubble.png';
import { IconButton, Toolbar } from '@material-ui/core';


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
            menuAnchor:null,
            profileMenuAnchor:null,
        }

        this.productService = new ProductService();
        this.formulaService = new FormulaService();
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
                console.error(data.response);
                let userId = this.getUserIdIfLoggedInOtherwiseMinus1();
                this.frontEndLogService.saveLog(userId, JSON.stringify(data.response));
            }
        });
    }

    getUserIdIfLoggedInOtherwiseMinus1() {
        return (this.state.isUserLoggedIn) ? this.state.userEntity.idUser : -1;
    }

    componentDidMount() {
        // many callbacks cause setstate is async. By doing this, we are sure that local storage user is well loaded before component gets rendered.
        this.setState({userEntity: JSON.parse(localStorage.getItem('userEntity'))}, () => {
            this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
                this.setState({loaded:true});
            });
        });
    }

    handleMenuClick(event) {
        this.setState({menuAnchor: event.currentTarget});
    }

    handleMenuClose() {
        this.setState({menuAnchor: null});
    }

    handleProfileMenuClick(event) {
        this.setState({profileMenuAnchor: event.currentTarget});
    }

    handleProfileMenuClose() {
        this.setState({profileMenuAnchor: null});
    }

/** TODO : Indiquer que le site utilise des cookies via une popup par dessus en bas à droite (cf screen bureau) + enregistrer le choix (localstorage ?) 
 * Cookies - indiquer que ceux d'illico sont nécessaires au bon fonctionnement du site et ne sont divulgués à quiconque
 * 
*/

    render() {
        let cpt = 0;

        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/home',
                slideDirection:'left'
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
                <div style={{flexGrow:1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" style={{marginRight: '2em'}}>
                                <MenuIcon/>
                            </IconButton>
                            <div style={{flexGrow:1}}/> {/* fills in the empty space */}

                            {
                                this.state.isUserLoggedIn && this.state.userEntity !== null && this.state.loaded ? 
                                    <Typography variant='body1' style={{color:'white'}}>
                                        Salut {this.state.userEntity.userPersonalInformationsByFkUserPersonalInformation.firstname} !
                                    </Typography>
                                    :
                                    <div>
                                    <IconButton aria-controls='simple-menu' aria-haspopup='true' edge='end' onClick={(event) => this.handleProfileMenuClick(event)}>
                                                <AccountCircleIcon/>
                                        </IconButton>
                                        <Menu
                                                id='profile-menu'
                                                anchorEl={this.state.profileMenuAnchor}
                                                keepMounted
                                                open={Boolean(this.state.profileMenuAnchor)}
                                                onClose={() => this.handleProfileMenuClose()}
                                            >
                                            
                                            <MenuItem component={Link} to={loginRedirectState} onClick={() => this.handleProfileMenuClose()}>
                                                    Se connecter
                                            </MenuItem>

                                            <MenuItem component={Link} to={registerRedirectState} onClick={() => this.handleProfileMenuClose()}>
                                                    M'enregistrer
                                            </MenuItem>
                                        </Menu>
                                    </div>
                            }
                        </Toolbar>
                    </AppBar>
                </div>

                <Slide direction='up' in={this.state.loaded} mountOnEnter unmountOnExit timeout={400}>
                    <div>
                        {/* TODO : affichage du catalogue, du menu en bas, etc. voir maquette. Si connecté, afficher certains trucs en + ? */ }

                        { /************************** CATEGORIES **************************/}

                        <div id="categories">
                            <Typography variant='h4' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontFamily:'Tisa', marginBottom:'1em'}}>
                                NOS CATÉGORIES {' '}
                            <img src={yellow_circle} alt='yellow geometric circles' style={{
                                height:'0.7em'
                            }}/>
                            </Typography>
                            {
                                this.state.categories !== null ?   
                                <Grid container spacing={3}>
                                {
                                    this.state.categories.map((item, index) => (
                                        <Grid key={index} item xs>
                                            <Typography variant='subtitle1' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00'}}>
                                            { 
                                                // gestion du pluriel et des emojis 😂
                                                item === 'Spiritueux' ?
                                                <IllicoChip text={'Les ' + item + ' 🥃'} color='primary' to='/none-for-now'/>
                                                : item === 'Vin' ?
                                                <IllicoChip text={'Les ' + item + 's 🍷'} color='primary' to='/none-for-now'/>
                                                : item === 'Champagne' ?
                                                <IllicoChip text={'Les ' + item + 's 🍾' } color='primary' to='/none-for-now'/>
                                                : item === 'Bière' ?
                                                <IllicoChip text={'Les ' + item + 's 🍺'} color='primary' to='/none-for-now'/>
                                                : 
                                                <IllicoChip text={'Les ' + item + 's 🥤'} color='primary' to='/none-for-now'/>
                                                
                                                
                                                
                                            } 
                                            </Typography>
                                            <IllicoCategory image={item} to='none-for-now'/>
                                        </Grid>
                                    ))
                                }
                                </Grid>
                                : <CircularProgress/>
                            }
                        </div>

                        <div style={{marginTop:'4em'}}/>
                        <Divider variant="middle" />
                        <div style={{marginBottom:'4em'}}/>


                        { /************************** FORMULAS **************************/}

                        <div id="formules">
                            <Typography variant='h4' gutterBottom style= {{ paddingTop:'0.1em', color:'#b26a00', fontFamily:'Tisa', marginBottom:'1em'}}>
                                NOS FORMULES {' '}
                                <img src={blue_bubble} alt='blue geometric circle' style={{
                                height:'0.7em'
                            }}/>
                            </Typography>
                            {
                                this.state.formulas !== null ?   
                                <div style= {{marginBottom:'5em'}}>
                                {
                                    <Grid container spacing={3}>
                                    {
                                        this.state.formulas.map(
                                            /**
                                            * 
                                            * @param {FormulaEntity} item 
                                            * @param {Number} index 
                                            * @returns some content 
                                            */
                                            (item, index) => (
                                            <Grid key={index} item xs>
                                                {/* TODO : HANDLE ADD TO BASKET FUNCTION + DISPLAY ANIMATION + DISPLAY '1', '2', etc. close to 'Panier' like notifications */}
                                                <IllicoFormula image={item.picturePath} title={item.name} description={item.description} price={item.price}
                                                onBasketAddClick={() => console.log(item)}/>
                                            </Grid>
                                        ))
                                    }
                                    </Grid>
        
                                }
                                </div>
                                : <CircularProgress/>
                            }
                        </div>

                    </div>
                </Slide>
                <div>
                    <Paper style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation showLabels value={this.state.bottomNavigationValue} onChange={(e, newValue) => this.setState({bottomNavigationValue: newValue})}>
                            <BottomNavigationAction label="Profil" icon={<Person/>}/>
                            <BottomNavigationAction label="Catalogue" icon={<HomeIcon/>}/>
                            <BottomNavigationAction label="Panier" icon={<ShoppingCart/>}/>
                        </BottomNavigation>
                    </Paper>
                </div>
            </div>
        )
    }
}
