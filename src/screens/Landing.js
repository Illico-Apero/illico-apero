import React            from 'react';

import Typography       from '@material-ui/core/Typography';
import Slide            from '@material-ui/core/Slide';

import IllicoButton     from '../components/IllicoButton';
import IllicoLogo       from '../components/IllicoLogo';

import Opened           from '../components/Landing/Opened';
import Closed           from '../components/Landing/Closed';
import StyledLink       from '../components/Generic/StyledLink';
import NoDecorationLink from '../components/Generic/NoDecorationLink';
import IllicoAudio from '../utils/IllicoAudio';
import StoreService from '../network/services/StoreService';
import StoreEntity from '../models/StoreEntity';

import ApiResponse from '../models/api/ApiResponse';
import { CircularProgress } from '@material-ui/core';
import configuration from '../config/configuration.json'
import { Alert } from '@material-ui/lab';

export default class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isUserLoggedIn: false,
            opened:false,
            closedProgrammatically:false,
            hours:[],
            days:[]
        }
        if(configuration.debug) console.warn('app is in debug mode');
        this.storeService = new StoreService();
    }

    componentDidMount() {
        this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
            this.storeService.isStoreOpened( (data) => {
                if(data.status !== ApiResponse.GET_ERROR()) {
                    if(data.status === ApiResponse.GET_WARNING()) {
                        console.warn("Store closed programmatically");
                        this.setState({closedProgrammatically:true});
                    }
                    this.setState({opened: data.response}, () => {
                        this.storeService.getStore( 
                            /**
                             * 
                             * @param {StoreEntity} data 
                             */
                            (data) => {
                            if(data.status === ApiResponse.GET_SUCCESS()) {
                                this.state.hours.push(data.response.openHour.slice(0, -3));
                                this.state.hours.push(data.response.closeHour.slice(0, -3));
                                this.state.days.push(data.response.daysAsList[0]);
                                this.state.days.push(data.response.daysAsList[data.response.daysAsList.length - 1]);
                                this.setState({loaded:true});
                            }
                        })
                    });
                }
                else {
                    this.setState({loaded:true});
                }
            })
        });
    }

    render() {
        const registerRedirectState = {
            pathname: '/register',
            state: {
                backUrl:'/',
                slideDirection:'left'
            }
        }
        const homeRedirectState = {
            pathname: '/home',
            state: {
                backUrl:'/',
                slideDirection:'left'
            }
        }
        const loginRedirectState = {
            pathname: '/login',
            state: {
                backUrl:'/',
                slideDirection:'left'
            }
        }
        return(
            <div>
                {
                    this.state.loaded ?
                    <div>
                        <Typography variant='h3' gutterBottom
                            style= {{
                                paddingTop:'0.1em',
                                color:'#b26a00'
                            }}>
                            Bienvenue !
                        </Typography>
                        <Slide  direction='right' in={this.state.loaded} mountOnEnter unmountOnExit timeout={800}>
                            <IllicoLogo style={{marginBottom:'0.4em'}}/>
                        </Slide>
                        <Typography variant='subtitle1' style={{whiteSpace: 'pre-line'}}>
                                Notre mission ?{'\n'}
                                Vous livrer de l'alcool sur l'agglomération de Dijon,{'\n'}
                                entre <b>{this.state.hours[0]} et {this.state.hours[1]}</b> du <b>{this.state.days[0]} au {this.state.days[1]}</b>
                        </Typography>
                        { // displays a green or red alert. 
                            (this.state.opened || configuration.debug) && !this.state.closedProgrammatically ?
                            <Opened/> : 
                            this.state.closedProgrammatically ?
                            <Alert severity="error" elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'260px', textAlign:'left'}}>
                                Les commandes sont fermées de manière exceptionnelle. Impossible de passer commande pour l'instant.
                                Suivez-nous sur nos réseaux sociaux pour plus d'informations :
                                <Typography variant='body1' style={{textAlign:'center'}}>
                                <br/>
                                <a  href='https://www.facebook.com/illico.apero.dijon'>Facebook</a>
                                <br/>
                                <br/>
                                <a  href='https://www.instagram.com/illico.apero.dijon/?hl=fr'>Instagram</a>
                                </Typography>
                            </Alert> 
                            /*TODO : Refactor with a component (3 code duplicates) */
                            :
                            <Closed/>
                        }

                        <NoDecorationLink to={homeRedirectState}>
                            <IllicoButton color='primary' text='Catalogue' onClick={() => IllicoAudio.playTapAudio()}/>
                        </NoDecorationLink>

                        {
                            this.state.isUserLoggedIn ? 
                            null
                            :
                            <div>
                                <NoDecorationLink to={registerRedirectState}>
                                    <IllicoButton color='primary' text='Inscription' onClick={() => IllicoAudio.playTapAudio()}/>
                                </NoDecorationLink>
                                <div onClick={() => IllicoAudio.playTapAudio()}>
                                    <StyledLink to={loginRedirectState}>Déjà inscrit ?</StyledLink>
                                </div>
                            </div>
                        }
                        <div id='footer' style={{
                            marginTop:'1em',
                            padding:'1em',
                            position:'relative',
                            bottom:0,
                            left:0
                        }}>
                            <Typography variant='body1' style={{fontStyle:'italic', fontSize:'10px'}}>
                                Illico Apéro - Vente d'alcool en livraison à Dijon.
                            </Typography>
                            <Typography variant='body1' style={{fontStyle:'italic', fontSize:'10px'}}>
                                Livraison sur Dijon et ses alentours en 30 minutes.
                            </Typography>
                            <Typography variant='body1' style={{fontStyle:'italic', fontSize:'10px'}}>
                                Vente de bières, spiritueux, champagnes, vins et boissons sur Dijon.
                            </Typography>
                        </div>
                    </div>
                    :
                    <CircularProgress/>
                }
            </div>
        );
    }
}