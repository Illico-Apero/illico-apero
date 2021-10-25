import React from 'react';
import Chip from '@material-ui/core/Chip';


/**
 * IllicoAddToBasket
 */
class IllicoAddToBasket extends React.Component
{
    render(){
        return(
            <div style={{marginLeft:'auto', marginRight:'auto'}}>
                <Chip label='Ajouter au panier 🛒' color='secondary' clickable 
            style={{marginBottom:'0.8em', marginTop:'0.8em', fontWeight:'bold', color:'#ffffff'}}/>
        </div>
        );
    }
}

export default IllicoAddToBasket;