import React from 'react';
import Typography from '@material-ui/core/Typography';
import IllicoButton from '../components/IllicoButton'
import IllicoLogo from '../components/IllicoLogo';

//TODO : init with API (bachus)
let hours = ['21:00', '04:00']; 
let days = ['Jeudi', 'Dimanche']

class Landing extends React.Component
{
    render()
    {
        return(
            <div>
                <Typography variant='h3' gutterBottom
                    style=
                    {{
                        marginTop:'2%',
                        color:'#b26a00'
                    }}>
                    Bienvenue chez Illico Apéro !
                </Typography>
                <IllicoLogo style={{marginBottom:'1%'}}/>
                <Typography variant='subtitle1' style={{whiteSpace: 'pre-line'}}>
                        Notre mission ?{'\n'}
                        Vous livrer de l'alcool sur l'agglomération de Dijon,{'\n'}
                        entre <b>{hours[0]} et {hours[1]}</b> du <b>{days[0]} au {days[1]}</b>
                </Typography>
                <IllicoButton text='Catalogue'/>
                <IllicoButton text='Inscription'/>
            </div>
        );
    }
}

export default Landing;