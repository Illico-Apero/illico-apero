import React            from 'react';
import { Link } from "react-router-dom";

import Typography       from '@material-ui/core/Typography';
import Slide            from '@material-ui/core/Slide';

import IllicoButton     from '../components/IllicoButton';
import IllicoLogo       from '../components/IllicoLogo';

import Opened           from '../components/Landing/Opened';
import Closed           from '../components/Landing/Closed';
import StyledLink from '../components/Generic/StyledLink';




//TODO : init with API (bachus)
let hours = ['21:00', '04:00']; 
let days = ['Jeudi', 'Dimanche']

//TODO : init isOpen according to current time & given opening times.
let isOpened = true;

export default class Landing extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            loaded: false,
        }
    }

    componentDidMount()
    {
        this.setState({loaded:true});
    }

    render()
    {
        return(
            <div>
                <Typography variant='h3' gutterBottom
                    style=
                    {{
                        paddingTop:'2%',
                        color:'#b26a00',
                    }}>
                    Bienvenue !
                </Typography>
                <Slide  
                    direction='right'
                    in={this.state.loaded}
                    mountOnEnter
                    unmountOnExit
                    timeout={800}>
                        <IllicoLogo style={{marginBottom:'1%'}}/>
                </Slide>
                <Typography variant='subtitle1' style={{whiteSpace: 'pre-line'}}>
                        Notre mission ?{'\n'}
                        Vous livrer de l'alcool sur l'agglomération de Dijon,{'\n'}
                        entre <b>{hours[0]} et {hours[1]}</b> du <b>{days[0]} au {days[1]}</b>
                </Typography>
                {
                    // displays a green or red alert.
                    isOpened? <Opened/> : <Closed/>
                }
                <StyledLink to="/home">
                    <IllicoButton color='primary' text='Catalogue'/>
                </StyledLink>

                <StyledLink to="/register">
                    <IllicoButton color='primary' text='Inscription'/>
                </StyledLink>
                <StyledLink to="/login">Déjà inscrit ?</StyledLink>
                
                {/* TODO Router, Links to different pages */}
            </div>
        );
    }
}