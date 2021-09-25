import React            from 'react';

import Typography       from '@material-ui/core/Typography';
import Slide            from '@material-ui/core/Slide';

import IllicoButton     from '../components/IllicoButton';
import IllicoLogo       from '../components/IllicoLogo';

import Opened           from '../components/Landing/Opened';
import Closed           from '../components/Landing/Closed';
import StyledLink       from '../components/Generic/StyledLink';
import NoDecorationLink from '../components/Generic/NoDecorationLink';



//TODO : init with API (bachus)
let hours = ['21:00', '04:00']; 
let days = ['Jeudi', 'Dimanche']

//TODO : init isOpen according to current time & given opening times.
let isOpened = true;

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isUserLoggedIn: false
        }
    }

    componentDidMount() {
        this.setState({isUserLoggedIn: JSON.parse(localStorage.getItem('isUserLoggedIn'))}, () => {
            this.setState({loaded:true});
        });
    }

    render() {
        //TODO : IF USER IS LOGGED IN, DISPLAY PROFILE BUTTON / MENU ABOVE ??? IDK

        return(
            <div>
                <Typography variant='h3' gutterBottom
                    style= {{
                        paddingTop:'0.1em',
                        color:'#b26a00',
                        fontFamily:'Tisa'
                    }}>
                    Bienvenue !
                </Typography>
                <Slide  direction='right' in={this.state.loaded} mountOnEnter unmountOnExit timeout={800}>
                    <IllicoLogo style={{marginBottom:'0.4em'}}/>
                </Slide>
                <Typography variant='subtitle1' style={{whiteSpace: 'pre-line', fontFamily:'Tisa'}}>
                        Notre mission ?{'\n'}
                        Vous livrer de l'alcool sur l'agglomération de Dijon,{'\n'}
                        entre <b>{hours[0]} et {hours[1]}</b> du <b>{days[0]} au {days[1]}</b>
                </Typography>
                { // displays a green or red alert. 
                    isOpened? 
                    <Opened/> : 
                    <Closed/>
                }

                {/* TODO : make redirection directly with IllicoButton*/}
                <NoDecorationLink to='/home'>
                    <IllicoButton color='primary' text='Catalogue'/>
                </NoDecorationLink>

                {
                    this.state.isUserLoggedIn ? 
                    null
                    :
                    <div>
                    <NoDecorationLink to='/register'>
                        <IllicoButton color='primary' text='Inscription'/>
                    </NoDecorationLink>
                    <StyledLink to='/login'>Déjà inscrit ?</StyledLink>
                    </div>
                }

                
                {/* TODO Router, Links to different pages */}
            </div>
        );
    }
}