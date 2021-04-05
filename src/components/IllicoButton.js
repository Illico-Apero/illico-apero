import React from 'react';
import Button from '@material-ui/core/Button'

/**
 * Basic Materiel UI Button
 * @param text : Modify the text property in order to
 * add a custom text
 */
class IllicoButton extends React.Component
{
    render()
    {
        return(
            <div>
                <Button 
                variant='contained'
                color='primary' 
                size='large'
                style={{
                    fontWeight:'bold',
                    color:'white',
                    fontSize:18,
                    marginTop:'2%',
                    marginBottom:'2%'
                }}>
                    {this.props.text}
                </Button>
            </div>
        );
    }
}

export default IllicoButton;