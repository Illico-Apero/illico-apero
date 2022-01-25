import { Badge, BottomNavigation, BottomNavigationAction, Fade, Link, Paper, Slide, Typography, Zoom } from '@material-ui/core';
import Person from '@material-ui/icons/Person';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import React from 'react';
import IllicoAudio from '../utils/IllicoAudio';
import HomeIcon from './Generic/HomeIcon';
import NoDecorationLink from './Generic/NoDecorationLink';
import NoDecorationLinkClass from './Generic/NoDecorationLinkClass';
import IllicoBottomBarAlert from './IllicoBottomBarAlert';

/**
 * Illico Apero Bottom Navigation
 * @param bottomNavigationValue: the activated bottomNavigation
 * @param profileRedirectState 
 * @param cartRedirectState
 */
class IllicoBottomNavigation extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            bottomNavigationValue:this.props.bottomNavigationValue,
            quantityInCart: this.props.quantityInCart,
            isAlcoholPage: /*this.props.isAlcoholPage*/ true, //ENABLE MESSAGE EVERYWHERE. LEAVE IT AS A BOOLEAN FOR EVENTUAL FUTURE MODIFICATIONS
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.quantityInCart !== this.props.quantityInCart) {
            this.setState({quantityInCart: this.props.quantityInCart});
        }
    }


    render()
    {
        const paperStyle = this.state.isAlcoholPage ?
        { position: 'fixed', bottom: 20, left: 0, right: 0, zIndex:5 } :
        { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex:5 }

        return(
            <Paper style={paperStyle} elevation={3}>
                <BottomNavigation showLabels value={this.state.bottomNavigationValue} onChange={(e, newValue) => this.setState({bottomNavigationValue: newValue})}>
                    <BottomNavigationAction label="Profil" icon={<Person/>} component={NoDecorationLinkClass} to='/profile' onClick={() => IllicoAudio.playNavigationForwardAudio()}/>
                    <BottomNavigationAction label="Catalogue" icon={<HomeIcon/>} component={NoDecorationLinkClass} to='/home' onClick={() => IllicoAudio.playNavigationForwardAudio()} />
                        <BottomNavigationAction label="Panier" icon={
                                    <Badge badgeContent={this.state.quantityInCart} color="primary">
                                        <ShoppingCart/>
                                    </Badge>
                            }   
                            component={NoDecorationLinkClass} to='/cart' onClick={() => IllicoAudio.playNavigationForwardAudio()}
                        />
                </BottomNavigation>

                {
                    this.state.isAlcoholPage ?
                    <IllicoBottomBarAlert text={"L'abus d'alcool est dangereux pour la santé."} 
						style={{top: 'auto', bottom: 0, textAlign:'left', paddingLeft:'0.5em'}}/>
                    :
                    ''
                }

        </Paper>
        );
    }
}

export default IllicoBottomNavigation;