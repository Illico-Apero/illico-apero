import React from 'react'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import IllicoAudio from '../utils/IllicoAudio';
import { Link } from 'react-router-dom';
import IllicoTopLogo from './IllicoTopLogo';


/**
 * @param {String} backUrl : the Url to which the user will be redirected when pressing "back" on top left
 * @param {Boolean} isUserLoggedIn : true if user logged in
 * @param {UserEntity} userEntity : the user entity
 * @param {Boolean} showLogo : if logo must be shown
 * @param {title} title : page title in case of nologo.
 */
export default class IllicoTopNavigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            generalMenuAnchor:null,
            profileMenuAnchor:null
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }
    
    handleGeneralMenuAnchorClick(event) {
        IllicoAudio.playUiUnlockAudio();
        this.setState({generalMenuAnchor: event.currentTarget});
    }
    handleGeneralMenuAnchorClose() {
        IllicoAudio.playUiLockAudio();
        this.setState({generalMenuAnchor: null});
    }
    handleDisconnect() {
        let loggedIn = JSON.parse(localStorage.getItem('isUserLoggedIn'));
        if(loggedIn) { //TODO : Use history and not window.location.reload
            this.handleGeneralMenuAnchorClose();
            localStorage.setItem('isUserLoggedIn', JSON.stringify(false));
            localStorage.setItem('userEntity', null);
            window.location.reload();
        } else { this.handleGeneralMenuAnchorClose(); }

    }
    handleProfileMenuAnchorClick(event) {
        IllicoAudio.playUiUnlockAudio();
        this.setState({profileMenuAnchor: event.currentTarget});
    }
    handleProfileMenuClose() {
        IllicoAudio.playUiLockAudio();
        this.setState({profileMenuAnchor: null});
    }

    render() {

        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:this.props.backUrl,
                slideDirection:'left'
            }
        }
        const registerRedirectState = {
            pathname: '/register',
            state: {
                backUrl:this.props.backUrl,
                slideDirection:'left'
            }
        }
        const forgottenPasswordRedirectState = {
            pathname: '/forgotten-password',
            state: {
                backUrl:this.props.backUrl,
                slideDirection:'left'
            }
        }
        const contactRedirectState = {
            pathname: '/contact',
            state: {
                backUrl:this.props.backUrl,
            }
        }
        const aboutRedirectState = {
            pathname: '/about',
            state: {
                backUrl:this.props.backUrl,
            }
        }
        const legalTermsRedirectState = {
            pathname: '/legal-terms',
            state: {
                backUrl:this.props.backUrl,
            }
        }
        return (
                <div style={{display:'-ms-flexbox', flexDirection:'row'}}>
                    <AppBar position="static">
                        <Toolbar>
                            <div style={{flexGrow:1, width:'15%'}}>
                                <IconButton aria-controls='simple-menu' aria-haspopup='true' edge="start" style={{float:'left'}} onClick={(event) => this.handleGeneralMenuAnchorClick(event)}>
                                    <MenuIcon/>
                                </IconButton>
                                <Menu
                                    id='general-menu'
                                    anchorEl={this.state.generalMenuAnchor}
                                    keepMounted
                                    open={Boolean(this.state.generalMenuAnchor)}
                                    onClose={() => this.handleGeneralMenuAnchorClose()}
                                >
                                {
                                    this.props.isUserLoggedIn && this.props.userEntity !== null && this.state.loaded ? 
                                        null
                                    :
                                    <MenuItem component={Link} to={forgottenPasswordRedirectState} onClick={() => this.handleGeneralMenuAnchorClose()}>
                                        Mot de passe oublié ?
                                    </MenuItem>
                                }
                                    <MenuItem component={Link} to={contactRedirectState} onClick={() => this.handleGeneralMenuAnchorClose()}>
                                            Nous contacter
                                    </MenuItem>
                                    <MenuItem component={Link} to={aboutRedirectState} onClick={() => this.handleGeneralMenuAnchorClose()}>
                                            À propos
                                    </MenuItem>
                                    <MenuItem component={Link} to={legalTermsRedirectState} onClick={() => this.handleGeneralMenuAnchorClose()}>
                                            Mentions Légales, CGV et CGU
                                    </MenuItem>
                                    {
                                        this.props.isUserLoggedIn && this.props.userEntity !== null && this.state.loaded ? 
                                        <MenuItem onClick={() => this.handleDisconnect()}>
                                            Me déconnecter
                                        </MenuItem>
                                        :
                                        null
                                    }

                                </Menu>
                            </div>
                            <div style={{flexGrow:1, width:'65%'}}> {/* fills in the empty space */}
                                {
                                    this.props.showLogo ?
                                        <IllicoTopLogo height={50} width={180} style={{alignContent:'center', alignSelf:'center'}} />
                                        :
                                        <Typography variant='h5' style= {{color:'white',fontWeight:'bold'}}>
                                            {this.props.title}
                                        </Typography>
                                }
                            </div>

                            <div style={{flexGrow:1, width:'20%'}}>
                            {
                                this.props.isUserLoggedIn && this.props.userEntity !== null && this.state.loaded ? 
                                    <Typography variant='body1' style={{color:'white', textAlign:'right'}}>
                                        Hey 🍻
                                    </Typography>
                                    :
                                    <div style={{float:'right'}}>
                                    <IconButton aria-controls='simple-menu' aria-haspopup='true' edge='start' onClick={(event) => this.handleProfileMenuAnchorClick(event)}>
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
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
        )
    }
}