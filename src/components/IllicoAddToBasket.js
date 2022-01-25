import React from 'react';
import Chip from '@material-ui/core/Chip';


/**
 * IllicoAddToBasket
 */
class IllicoAddToBasket extends React.Component
{
    render(){
        let disabled = !this.props.available
        return(
            <div style={{marginLeft:'auto', marginRight:'auto'}}>
                <Chip label='Ajouter au panier 🛒' color='primary' clickable  disabled={disabled}
            style={{marginBottom:'0.8em', marginTop:'0.8em', fontWeight:'bold', color:'#ffffff'}}/>
        </div>
        );
    }
}

export default IllicoAddToBasket;