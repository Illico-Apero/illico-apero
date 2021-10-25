import React from 'react'
import Slide from '@material-ui/core/Slide';
import { Typography } from '@material-ui/core';

import StyledLink       from '../components/Generic/StyledLink';
import IllicoAudio from '../utils/IllicoAudio';
import Register from '../screens/Register';


/**
 * @param loginRedirectState
 */
export default class IllicoAskForConnection extends React.Component {

    constructor(props) {
        super(props);
        const defaultLoginRedirectState={
            pathname: '/login',
            state: {
                backUrl:'/home',
                slideDirection:'left',
            }
        }
        this.state = {
            loaded: false,
            loginRedirectState:this.props.loginRedirectState !== null ? this.props.loginRedirectState : defaultLoginRedirectState
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }


    render() {
        return (
            
                <div style={{marginBottom:'4em'}}>
                    <Slide direction='left' in={this.state.loaded} mountOnEnter unmountOnExit timeout={300}>
                        <div>
                            <Typography variant='h4' gutterBottom style= {{ paddingTop:'0.4em', color:'#b26a00', marginBottom:'0.7em'}}>
                                Vous n'êtes pas connecté(e) 😋
                            </Typography>
                            <div onClick={() => IllicoAudio.playTapAudio()}>
                            <StyledLink to={this.props.loginRedirectState}>Déjà inscrit ?</StyledLink>
                            </div>
                            <Typography variant='subtitle1' gutterBottom style= {{ paddingTop:'1.5em', color:'#b26a00', marginBottom:'1em'}}>
                                Vous pouvez également créer un compte avec le formulaire ci-dessous :
                            </Typography>
                        </div>
                    </Slide>
                    <Register hideTopAppBar/>
                </div>

        )
    }
}