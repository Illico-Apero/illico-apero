import React from 'react';
import Button from '@material-ui/core/Button'

/**
 * Basic Materiel UI Button
 * @param color: the button color
 * @param onClick: the button action
 */
class IllicoButton extends React.Component
{
    render()
    {
        return(
            <div>
                <Button 
                disabled={this.props.disabled}
                variant='contained'
                color={this.props.color}
                onClick={this.props.onClick}
                style={{
                    fontWeight:'bold',
                    fontSize:18,
                    marginTop:'1em',
                    marginBottom:'1.5em',
                    
                }}>
                    {this.props.text}
                </Button>
            </div>
        );
    }
}

export default IllicoButton;